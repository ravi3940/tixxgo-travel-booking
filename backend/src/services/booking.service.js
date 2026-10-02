import prisma from "../config/database.js";
import supplierGateway from "../suppliers/supplier.gateway.js";

import { createRequestHash } from "../utils/idempotency.js";

const createBooking = async ({
    offerId,
    traveller,
    idempotencyKey,
    requestBody
}) => {

    if (!idempotencyKey) {
        const error = new Error("Idempotency-Key is required");
        error.statusCode = 400;
        throw error;
    }

    // Create hash of the original request
    const requestHash = createRequestHash(requestBody);

    // Check whether this idempotency key was already used
    const existingKey = await prisma.idempotencyKey.findUnique({
        where: {
            key: idempotencyKey
        }
    });

    if (existingKey) {

        // Same key + different request = invalid reuse
        if (existingKey.requestHash !== requestHash) {
            const error = new Error(
                "Idempotency-Key cannot be reused with a different request"
            );

            error.statusCode = 409;

            throw error;
        }

        // Same key + completed request = return previous response
        if (existingKey.response) {
            return {
                ...existingKey.response,
                idempotentReplay: true
            };
        }

        // Same key + request still processing
        const error = new Error(
            "Request with this Idempotency-Key is already being processed"
        );

        error.statusCode = 409;

        throw error;
    }

    // --------------------------------------------------
    // 1. Find flight offer
    // --------------------------------------------------

    const flightOffer = await prisma.flightOffer.findUnique({
        where: {
            offerId
        }
    });

    if (!flightOffer) {
        const error = new Error("Flight offer not found");
        error.statusCode = 404;
        throw error;
    }

    // --------------------------------------------------
    // 2. Create idempotency record first
    // --------------------------------------------------

    try {
        await prisma.idempotencyKey.create({
            data: {
                key: idempotencyKey,
                requestHash,
                response: null
            }
        });
    } catch (error) {

        // Another request may have created the same key
        // between our findUnique() and create()
        if (error.code === "P2002") {

            const existingKeyAfterRace =
                await prisma.idempotencyKey.findUnique({
                    where: {
                        key: idempotencyKey
                    }
                });

            if (
                existingKeyAfterRace &&
                existingKeyAfterRace.requestHash !== requestHash
            ) {
                const conflictError = new Error(
                    "Idempotency-Key cannot be reused with a different request"
                );

                conflictError.statusCode = 409;

                throw conflictError;
            }

            const conflictError = new Error(
                "Request with this Idempotency-Key is already being processed"
            );

            conflictError.statusCode = 409;

            throw conflictError;
        }

        throw error;
    }

    // --------------------------------------------------
    // 3. Generate Tixxgo booking reference
    // --------------------------------------------------

    const tixxgoBookingReference =
        `TXG-${Date.now()}`;

    // --------------------------------------------------
    // 4. Create booking
    // --------------------------------------------------

    try {

        const booking = await prisma.booking.create({
            data: {

                tixxgoBookingReference,

                flightOfferId:
                    flightOffer.id,

                supplier:
                    flightOffer.supplier,

                supplierResultId:
                    flightOffer.supplierResultId,

                supplierTotal:
                    flightOffer.supplierTotal,

                customerTotal:
                    flightOffer.customerTotal,

                paymentStatus:
                    "PENDING",

                bookingStatus:
                    "PAYMENT_PENDING",

                ticketingStatus:
                    "PENDING",

                travellers: {
                    create: {

                        firstName:
                            traveller.firstName,

                        lastName:
                            traveller.lastName,

                        email:
                            traveller.email,

                        phone:
                            traveller.phone,

                        dateOfBirth:
                            traveller.dateOfBirth
                                ? new Date(traveller.dateOfBirth)
                                : null,

                        gender:
                            traveller.gender || null,

                        passportNumber:
                            traveller.passportNumber || null
                    }
                }
            },

            include: {
                travellers: true,
                flightOffer: true
            }
        });

        // --------------------------------------------------
        // 5. Save response against idempotency key
        // --------------------------------------------------

        await prisma.idempotencyKey.update({
            where: {
                key: idempotencyKey
            },
            data: {
                response: booking
            }
        });

        return booking;

    } catch (error) {

        // If booking creation fails, remove the temporary
        // idempotency record so the client can safely retry.
        await prisma.idempotencyKey.delete({
            where: {
                key: idempotencyKey
            }
        }).catch(() => {});

        throw error;
    }
};



const processPayment = async (bookingId, idempotencyKey) => {

    if (!idempotencyKey) {
        const error = new Error("Idempotency-Key is required");
        error.statusCode = 400;
        throw error;
    }

    const booking = await prisma.booking.findUnique({
        where: {
            id: Number(bookingId)
        }
    });

    if (!booking) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
    }

    // Check whether this payment request was already processed
    const existingPayment = await prisma.payment.findUnique({
        where: {
            idempotencyKey
        }
    });

    if (existingPayment) {
        return {
            payment: existingPayment,
            idempotentReplay: true
        };
    }

    // Already paid through another request
    if (booking.paymentStatus === "SUCCESS") {
        return {
            payment: null,
            idempotentReplay: true,
            message: "Payment already completed"
        };
    }

    if (booking.paymentStatus !== "PENDING") {
        const error = new Error(
            `Payment cannot be processed from status ${booking.paymentStatus}`
        );

        error.statusCode = 409;
        throw error;
    }

    const paymentReference =
        `PAY-${Date.now()}`;

    const payment = await prisma.$transaction(async (tx) => {

        const createdPayment = await tx.payment.create({
            data: {
                bookingId: booking.id,
                paymentReference,
                idempotencyKey,
                amount: booking.customerTotal,
                status: "SUCCESS"
            }
        });

        await tx.booking.update({
            where: {
                id: booking.id
            },
            data: {
                paymentStatus: "SUCCESS",
                bookingStatus: "SUPPLIER_BOOKING"
            }
        });

        return createdPayment;
    });

    return {
        payment,
        idempotentReplay: false
    };
};

const bookWithSupplier = async (bookingId, simulation = "SUCCESS") => {

    const booking = await prisma.booking.findUnique({
        where: {
            id: Number(bookingId)
        },
        include: {
            travellers: true,
            flightOffer: true
        }
    });

    if (!booking) {

        const error = new Error(
            "Booking not found"
        );

        error.statusCode = 404;

        throw error;
    }

    // --------------------------------------------------
    // 1. Prevent duplicate supplier booking
    // --------------------------------------------------

    if (
        booking.bookingStatus ===
        "BOOKING_CONFIRMED"
    ) {

        return {
            status: "BOOKING_CONFIRMED",
            message:
                "Booking already confirmed. Duplicate supplier booking prevented.",
            bookingId:
                booking.id,
            supplierBookingReference:
                booking.supplierBookingReference
        };
    }

    // --------------------------------------------------
    // 2. Payment must be successful
    // --------------------------------------------------

    if (
        booking.paymentStatus !==
        "SUCCESS"
    ) {

        const error = new Error(
            "Payment must be successful before supplier booking"
        );

        error.statusCode = 409;

        throw error;
    }

    // --------------------------------------------------
    // 3. Booking must be ready for supplier booking
    // --------------------------------------------------

    if (
        booking.bookingStatus !==
        "SUPPLIER_BOOKING"
    ) {

        // Allow reconciliation for UNKNOWN bookings
        if (
            booking.bookingStatus !==
            "BOOKING_UNKNOWN"
        ) {

            const error = new Error(
                "Booking is not ready for supplier booking"
            );

            error.statusCode = 409;

            throw error;
        }
    }

    // --------------------------------------------------
    // 4. Get traveller
    // --------------------------------------------------

    const traveller =
        booking.travellers[0];

    if (!traveller) {

        const error = new Error(
            "Traveller information not found"
        );

        error.statusCode = 400;

        throw error;
    }

    // --------------------------------------------------
    // 5. Call supplier
    // --------------------------------------------------

    let supplierResponse;

    try {

        supplierResponse =
            await supplierGateway.bookFlight({

                supplierResultId:
                    booking.supplierResultId,

                traveller: {

                    firstName:
                        traveller.firstName,

                    lastName:
                        traveller.lastName,

                    email:
                        traveller.email,

                    phone:
                        traveller.phone
                },

                simulation
            });

    } catch (error) {

        // --------------------------------------------------
        // Supplier timeout
        // --------------------------------------------------

        if (
            error.code ===
            "SUPPLIER_TIMEOUT"
        ) {

            await prisma.booking.update({

                where: {
                    id: booking.id
                },

                data: {

                    bookingStatus:
                        "BOOKING_UNKNOWN"
                }
            });

            return {

                status:
                    "BOOKING_UNKNOWN",

                message:
                    "Supplier request timed out. Booking may have been created at supplier.",

                bookingId:
                    booking.id,

                requiresReconciliation:
                    true
            };
        }

        // --------------------------------------------------
        // Unexpected supplier error
        // --------------------------------------------------

        await prisma.booking.update({

            where: {
                id: booking.id
            },

            data: {

                bookingStatus:
                    "BOOKING_UNKNOWN"
            }
        });

        return {

            status:
                "BOOKING_UNKNOWN",

            message:
                "Unable to determine supplier booking result.",

            bookingId:
                booking.id,

            requiresReconciliation:
                true
        };
    }

    // --------------------------------------------------
    // 6. Supplier returned failure
    // --------------------------------------------------

    if (
        !supplierResponse.success
    ) {

        await prisma.booking.update({

            where: {
                id: booking.id
            },

            data: {

                bookingStatus:
                    "BOOKING_FAILED"
            }
        });

        const error = new Error(
            supplierResponse.message ||
            "Supplier booking failed"
        );

        error.statusCode = 502;

        throw error;
    }

    // --------------------------------------------------
    // 7. Supplier booking successful
    // --------------------------------------------------

    const updatedBooking =
        await prisma.booking.update({

            where: {
                id: booking.id
            },

            data: {

                supplierBookingReference:
                    supplierResponse
                        .supplierBookingReference,

                bookingStatus:
                    "BOOKING_CONFIRMED",

                ticketingStatus:
                    "TICKETED"
            }
        });

    // --------------------------------------------------
    // 8. Return booking result
    // --------------------------------------------------

    return {

        status:
            "BOOKING_CONFIRMED",

        bookingId:
            updatedBooking.id,

        tixxgoBookingReference:
            updatedBooking
                .tixxgoBookingReference,

        supplier:
            updatedBooking.supplier,

        supplierBookingReference:
            updatedBooking
                .supplierBookingReference,

        ticketNumber:
            supplierResponse.ticketNumber,

        bookingStatus:
            updatedBooking
                .bookingStatus,

        ticketingStatus:
            updatedBooking
                .ticketingStatus
    };
};

const reconcileBooking = async (bookingId) => {

    const booking = await prisma.booking.findUnique({
        where: {
            id: Number(bookingId)
        }
    });

    if (!booking) {

        const error = new Error(
            "Booking not found"
        );

        error.statusCode = 404;

        throw error;
    }


    // --------------------------------------------------
    // 1. Already confirmed
    // --------------------------------------------------

    if (
        booking.bookingStatus ===
        "BOOKING_CONFIRMED"
    ) {

        return {
            status: "BOOKING_CONFIRMED",

            message:
                "Booking is already confirmed",

            bookingId:
                booking.id,

            supplierBookingReference:
                booking.supplierBookingReference
        };
    }


    // --------------------------------------------------
    // 2. Only UNKNOWN bookings require reconciliation
    // --------------------------------------------------

    if (
        booking.bookingStatus !==
        "BOOKING_UNKNOWN"
    ) {

        const error = new Error(
            "Booking does not require reconciliation"
        );

        error.statusCode = 409;

        throw error;
    }


    // --------------------------------------------------
    // 3. Ask supplier about the booking
    // --------------------------------------------------

    let supplierResponse;


    // We received a supplier PNR
    if (
        booking.supplierBookingReference
    ) {

        supplierResponse =
            await supplierGateway.getBookingStatus({

                supplierBookingReference:
                    booking.supplierBookingReference
            });

    }

    // Timeout happened before we received PNR
    else {

        supplierResponse =
            await supplierGateway.findBookingByResultId({

                supplierResultId:
                    booking.supplierResultId
            });
    }


    // --------------------------------------------------
    // 4. Supplier confirms booking
    // --------------------------------------------------

    if (
        supplierResponse.success &&
        supplierResponse.status ===
        "CONFIRMED"
    ) {

        const updatedBooking =
            await prisma.booking.update({

                where: {
                    id: booking.id
                },

                data: {

                    supplierBookingReference:
                        supplierResponse
                            .supplierBookingReference,

                    bookingStatus:
                        "BOOKING_CONFIRMED",

                    ticketingStatus:
                        "TICKETED"
                }
            });


        return {

            status:
                "BOOKING_CONFIRMED",

            message:
                "Supplier booking confirmed during reconciliation",

            bookingId:
                updatedBooking.id,

            tixxgoBookingReference:
                updatedBooking
                    .tixxgoBookingReference,

            supplier:
                updatedBooking.supplier,

            supplierBookingReference:
                updatedBooking
                    .supplierBookingReference,

            ticketNumber:
                supplierResponse.ticketNumber,

            bookingStatus:
                updatedBooking
                    .bookingStatus,

            ticketingStatus:
                updatedBooking
                    .ticketingStatus
        };
    }

    return {
        status: "BOOKING_UNKNOWN", message: "Supplier has not confirmed the booking yet", bookingId: booking.id, supplierResultId:
            booking.supplierResultId,
        requiresReconciliation: true
    };
};

export default {
    createBooking,
    processPayment,
    bookWithSupplier,
    reconcileBooking
};