import express from "express";

import {
    getCancellationQuote,
    cancelBooking
} from "../controllers/cancellation.controller.js";

const router = express.Router();

router.post(
    "/:bookingId/cancellation-quote",
    getCancellationQuote
);

router.post(
    "/:bookingId/cancel",
    cancelBooking
);

export default router;