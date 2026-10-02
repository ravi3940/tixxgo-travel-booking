import supplierGateway from "../suppliers/supplier.gateway.js";
import pricingService from "./pricing.service.js";
import prisma from "../config/database.js";

const searchFlights = async (request) => {

    // TBO is currently the primary supplier
    const supplierFlights =
        await supplierGateway.searchFlights(
            "TBO",
            request
        );

    const flights = [];

    for (const flight of supplierFlights) {

        const pricing =
            pricingService.calculatePricing({
                baseFare: flight.baseFare,
                taxes: flight.taxes
            });

        const offerId =
            `${flight.supplier}-${flight.supplierResultId}`;

        const flightOffer =
            await prisma.flightOffer.upsert({

                where: {
                    offerId
                },

                update: {
                    supplierBaseFare:
                        pricing.supplierBaseFare,

                    supplierTaxes:
                        pricing.supplierTaxes,

                    supplierTotal:
                        pricing.supplierTotal,

                    serviceFee:
                        pricing.serviceFee,

                    discount:
                        pricing.discount,

                    customerTotal:
                        pricing.customerTotal
                },

                create: {

                    offerId,

                    supplier:
                        flight.supplier,

                    supplierResultId:
                        flight.supplierResultId,

                    airlineCode:
                        flight.airline,

                    flightNumber:
                        flight.flightNumber,

                    origin:
                        flight.origin,

                    destination:
                        flight.destination,

                    departure:
                        new Date(flight.departure),

                    arrival:
                        new Date(flight.arrival),

                    baggage:
                        flight.baggage,

                    refundable:
                        flight.refundable,

                    supplierBaseFare:
                        pricing.supplierBaseFare,

                    supplierTaxes:
                        pricing.supplierTaxes,

                    supplierTotal:
                        pricing.supplierTotal,

                    serviceFee:
                        pricing.serviceFee,

                    discount:
                        pricing.discount,

                    customerTotal:
                        pricing.customerTotal,

                    currency:
                        pricing.currency
                }
            });

        flights.push({

            offerId:
                flightOffer.offerId,

            supplier:
                flight.supplier,

            supplierResultId:
                flight.supplierResultId,

            airline:
                flight.airline,

            flightNumber:
                flight.flightNumber,

            origin:
                flight.origin,

            destination:
                flight.destination,

            departure:
                flight.departure,

            arrival:
                flight.arrival,

            baggage:
                flight.baggage,

            refundable:
                flight.refundable,

            pricing
        });
    }

    return flights;
};


// const revalidateFlight = async (offerId) => {

//   const offer = await prisma.flightOffer.findUnique({
//     where: {
//       offerId
//     }
//   });

//   if (!offer) {
//     throw new Error(`Flight offer ${offerId} not found`);
//   }

//   const oldPrice = Number(offer.customerTotal);
//   const newPrice = oldPrice + 200;

//   return {
//     success: true,
//     status: "PRICE_CHANGED",
//     offerId,
//     oldPrice,
//     newPrice,
//     requiresAcceptance: true
//   };
// };




const revalidateFlight = async (offerId) => {

    const offer =await prisma.flightOffer.findUnique({
            where: {
                offerId: offerId
            }
        });
    console.log(
        "DATABASE OFFER:",
        offer
    );


    if (!offer) {

        throw new Error(
            `Flight offer ${offerId} not found`
        );
    }


    const oldPrice =
        Number(
            offer.customerTotal
        );

    const newPrice =
        oldPrice + 200;


    return {

        success: true,

        status:
            "PRICE_CHANGED",

        offerId:
            offer.offerId,

        oldPrice:
            oldPrice,

        newPrice:
            newPrice,

        requiresAcceptance:
            true
    };
};



const acceptPriceChange = async (
    offerId,
    acceptedPrice
) => {

    const offer =
        await prisma.flightOffer.findUnique({
            where: {
                offerId
            }
        });

    if (!offer) {
        const error =
            new Error("Flight offer not found");

        error.statusCode = 404;

        throw error;
    }

    const currentPrice =
        Number(offer.customerTotal);

    // Mock supplier's latest price
    const latestPrice = 6449;

    if (Number(acceptedPrice) !== latestPrice) {

        const error = new Error(
            "Accepted price does not match the latest flight price"
        );

        error.statusCode = 409;

        throw error;
    }

    const updatedOffer =
        await prisma.flightOffer.update({

            where: {
                offerId
            },

            data: {
                customerTotal: acceptedPrice
            }
        });

    return {
        status: "PRICE_ACCEPTED",
        offerId: updatedOffer.offerId,
        oldPrice: currentPrice,
        acceptedPrice:
            Number(updatedOffer.customerTotal),
        currency: updatedOffer.currency
    };
};

const acceptPrice = async (offerId, acceptedPrice) => {

    const offer = await prisma.flightOffer.findUnique({
        where: {
            offerId
        }
    });

    if (!offer) {
        throw new Error(`Flight offer ${offerId} not found`);
    }

    const price = Number(acceptedPrice);

    if (!price || price <= 0) {
        throw new Error("Invalid accepted price");
    }

    const revalidatedPrice = Number(offer.customerTotal) + 200;

    if (price !== revalidatedPrice) {
        throw new Error(
            `Accepted price does not match revalidated price. Expected ${revalidatedPrice}`
        );
    }

    const updatedOffer = await prisma.flightOffer.update({
        where: {
            offerId
        },
        data: {
            customerTotal: price
        }
    });

    return {
        success: true,
        status: "PRICE_ACCEPTED",
        offerId: updatedOffer.offerId,
        customerTotal: Number(updatedOffer.customerTotal)
    };
};

export default {
    searchFlights,
    revalidateFlight,
    acceptPriceChange,
    acceptPrice
};