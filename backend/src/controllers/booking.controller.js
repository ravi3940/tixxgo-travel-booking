import bookingService from "../services/booking.service.js";

export const createBooking = async (req, res) => {
    try {

        const {
            offerId,
            traveller
        } = req.body;

        const idempotencyKey =
            req.get("Idempotency-Key");

        const booking =
            await bookingService.createBooking({
                offerId,
                traveller,
                idempotencyKey,
                requestBody: req.body
            });

        return res.status(201).json({
            success: true,
            message: booking.idempotentReplay
                ? "Booking already created. Returning previous response."
                : "Booking created successfully",
            data: booking
        });

    } catch (error) {

        console.error("Create booking error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message ||
                "Unable to create booking"
        });
    }
};


export const processPayment = async (req, res) => {
    try {

        const { bookingId } = req.params;

        const idempotencyKey =
            req.get("Idempotency-Key");

        const result =
            await bookingService.processPayment(
                bookingId,
                idempotencyKey
            );

        return res.status(200).json({
            success: true,
            message: result.idempotentReplay
                ? "Payment already processed. Returning previous result."
                : "Payment successful",
            data: result
        });

    } catch (error) {

        console.error("Payment error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message ||
                "Payment processing failed"
        });
    }
};

export const bookWithSupplier = async (req, res) => {

    try {

        const { bookingId } = req.params;

        const {
            simulation = "SUCCESS"
        } = req.body || {};

        if (!bookingId) {

            return res.status(400).json({
                success: false,
                message: "bookingId is required"
            });
        }

        const result =
            await bookingService.bookWithSupplier(
                bookingId,
                simulation
            );

        let message =
            "Flight booked with supplier successfully";

        if (
            result.message &&
            result.message.includes(
                "already confirmed"
            )
        ) {
            message = "Booking already confirmed";
        }

        if (
            result.status ===
            "BOOKING_UNKNOWN"
        ) {
            message =
                "Supplier booking requires reconciliation";
        }

        return res.status(200).json({
            success: true,
            message,
            data: result
        });

    } catch (error) {

        console.error(
            "Supplier booking error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Supplier booking failed"
        });
    }
};

export const reconcileBooking = async (req, res) => {

    try {

        const { bookingId } = req.params;

        if (!bookingId) {

            return res.status(400).json({
                success: false,
                message: "bookingId is required"
            });
        }

        const result =
            await bookingService.reconcileBooking(
                bookingId
            );

        return res.status(200).json({
            success: true,
            message:
                result.message ||
                "Booking reconciliation completed",
            data: result
        });

    } catch (error) {

        console.error(
            "Booking reconciliation error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Unable to reconcile booking"
        });
    }
};