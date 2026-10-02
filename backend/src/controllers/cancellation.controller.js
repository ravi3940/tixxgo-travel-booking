import cancellationService
    from "../services/cancellation.service.js";

export const getCancellationQuote = async (req, res) => {

    try {

        const { bookingId } = req.params;

        const result =
            await cancellationService.getCancellationQuote(
                bookingId
            );

        return res.status(200).json({
            success: true,
            message:
                "Cancellation quote generated successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Cancellation quote error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Unable to generate cancellation quote"
        });
    }
};


export const cancelBooking = async (req, res) => {

    try {

        const { bookingId } = req.params;

        const {
            confirm = false
        } = req.body || {};

        const result =
            await cancellationService.cancelBooking(
                bookingId,
                confirm
            );

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result
        });

    } catch (error) {

        console.error(
            "Cancellation error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Unable to cancel booking"
        });
    }
};