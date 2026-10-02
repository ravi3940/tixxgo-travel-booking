import flightService from "../services/flight.service.js";

export const searchFlights = async (req, res) => {

    try {

        const {
            origin,
            destination,
            departureDate,
            adults,
            cabinClass
        } = req.body;

        if (
            !origin ||
            !destination ||
            !departureDate ||
            !adults ||
            !cabinClass
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid flight search request"
            });
        }

        const flights =
            await flightService.searchFlights(req.body);

        return res.status(200).json({
            success: true,
            count: flights.length,
            data: flights
        });

    } catch (error) {

        console.error(
            "Flight search error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to search flights"
        });
    }
};


// export const revalidateFlight = async (req, res) => {
//   try {
//     const { offerId } = req.params;

//     const result = await flightService.revalidateFlight(offerId);

//     res.status(200).json(result);

//   } catch (error) {
//     console.error("Revalidation error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };




export const revalidateFlight = async (
    req,
    res
) => {

    try {

        const {
            offerId
        } = req.params;


        console.log(
            "CONTROLLER OFFER ID:",
            offerId
        );


        if (!offerId) {

            return res.status(400).json({

                success: false,

                message:
                    "Offer ID is required"
            });
        }


        const result =
            await flightService
                .revalidateFlight(
                    offerId
                );


        return res
            .status(200)
            .json(result);


    } catch (error) {

        console.error(
            "REVALIDATION BACKEND ERROR:",
            error
        );


        return res
            .status(500)
            .json({

                success: false,

                message:
                    error.message
            });
    }
};


export const acceptPriceChange = async (req, res) => {

    try {

        const {
            offerId,
            acceptedPrice
        } = req.body;

        if (!offerId || acceptedPrice === undefined) {
            return res.status(400).json({
                success: false,
                message: "offerId and acceptedPrice are required"
            });
        }

        const result =
            await flightService.acceptPriceChange(
                offerId,
                Number(acceptedPrice)
            );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(
            "Price acceptance error:",
            error
        );

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message ||
                "Unable to accept price"
        });
    }
};

export const acceptFlightPrice = async (req, res) => {

    try {

        const { offerId } = req.params;
        const { acceptedPrice } = req.body;

        const result = await flightService.acceptPrice(
            offerId,
            acceptedPrice
        );

        return res.status(200).json(result);

    } catch (error) {

        console.error("ACCEPT PRICE ERROR:", error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};