import express from "express";

import {
    createBooking,
    processPayment,
    bookWithSupplier,
    reconcileBooking
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post(
    "/",
    createBooking
);

router.post(
    "/:bookingId/payment",
    processPayment
);

router.post(
    "/:bookingId/supplier-booking",
    bookWithSupplier
);

router.post(
    "/:bookingId/reconcile",
    reconcileBooking
);

export default router;