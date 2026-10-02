import express from "express";
import {
    searchFlights,
    revalidateFlight,
    acceptPriceChange ,
    acceptFlightPrice
} from "../controllers/flight.controller.js";

const router = express.Router();

router.post("/search", searchFlights);

router.post("/:offerId/revalidate", revalidateFlight);

router.post("/accept-price",acceptPriceChange);
router.post(
    "/:offerId/accept-price",
    acceptFlightPrice
);

export default router;