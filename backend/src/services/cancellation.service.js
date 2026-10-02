import prisma from "../config/database.js";

const getCancellationQuote = async (bookingId) => {

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

    if (booking.bookingStatus !== "BOOKING_CONFIRMED") {
        const error = new Error(
            "Only confirmed bookings can be cancelled"
        );

        error.statusCode = 409;
        throw error;
    }

    // Mock cancellation charges
    const supplierCharge = 500;
    const tixxgoFee = 199;

    const refundAmount =
        Number(booking.customerTotal) -
        supplierCharge -
        tixxgoFee;

    return {
        bookingId: booking.id,
        tixxgoBookingReference:
            booking.tixxgoBookingReference,

        customerTotal:
            Number(booking.customerTotal),

        supplierCharge,

        tixxgoFee,

        refundAmount,

        currency: "INR",

        status: "CANCELLATION_QUOTE"
    };
};

const cancelBooking = async (
    bookingId,
    confirm = false
) => {

    if (!confirm) {
        const error = new Error(
            "Cancellation confirmation is required"
        );

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

    if (booking.bookingStatus === "CANCELLED") {
        return {
            bookingId: booking.id,
            status: "CANCELLED",
            message: "Booking is already cancelled"
        };
    }

    if (booking.bookingStatus !== "BOOKING_CONFIRMED") {
        const error = new Error(
            "Only confirmed bookings can be cancelled"
        );

        error.statusCode = 409;
        throw error;
    }

    // Mock cancellation charges
    const supplierCharge = 500;
    const tixxgoFee = 199;

    const refundAmount =
        Number(booking.customerTotal) -
        supplierCharge -
        tixxgoFee;

    const cancellation =
        await prisma.$transaction(async (tx) => {

            const cancellationRecord =
                await tx.cancellation.create({
                    data: {
                        bookingId: booking.id,
                        supplierCharge,
                        tixxgoFee,
                        refundAmount,
                        status:
                            "CANCELLATION_REQUESTED"
                    }
                });

            await tx.booking.update({
                where: {
                    id: booking.id
                },
                data: {
                    bookingStatus:
                        "CANCELLATION_REQUESTED"
                }
            });

            return cancellationRecord;
        });

    // -----------------------------------------
    // Mock supplier cancellation
    // -----------------------------------------

    await prisma.cancellation.update({
        where: {
            id: cancellation.id
        },
        data: {
            status: "CANCELLED"
        }
    });

    await prisma.booking.update({
        where: {
            id: booking.id
        },
        data: {
            bookingStatus: "CANCELLED"
        }
    });

    // -----------------------------------------
    // Mock refund
    // -----------------------------------------

    await prisma.cancellation.update({
        where: {
            id: cancellation.id
        },
        data: {
            status: "REFUND_PENDING"
        }
    });

    await prisma.booking.update({
        where: {
            id: booking.id
        },
        data: {
            bookingStatus: "CANCELLED",
            paymentStatus: "REFUND_PENDING"
        }
    });

    // Simulate successful refund
    await prisma.cancellation.update({
        where: {
            id: cancellation.id
        },
        data: {
            status: "REFUNDED"
        }
    });

    const updatedBooking =
        await prisma.booking.update({
            where: {
                id: booking.id
            },
            data: {
                bookingStatus: "CANCELLED",
                paymentStatus: "REFUNDED"
            }
        });

    return {
        bookingId: updatedBooking.id,

        tixxgoBookingReference:
            updatedBooking.tixxgoBookingReference,

        status: "REFUNDED",

        supplierCharge,

        tixxgoFee,

        refundAmount,

        currency: "INR",

        message:
            "Booking cancelled and refund processed successfully"
    };
};

export default {
    getCancellationQuote,
    cancelBooking
};