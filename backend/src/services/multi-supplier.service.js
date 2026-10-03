import prisma from "../config/database.js";
import supplierGateway from "../suppliers/supplier.gateway.js";
import {
    getCache,
    setCache
} from "../services/cache/cache.service.js";

import {
    flightSearchCacheKey
} from  "../utils/cache-key.js"

const calculateSupplierTotal = (flight) => {

    const baseFare = Number(flight.baseFare || 0);
    const taxes = Number(flight.taxes || 0);

    return baseFare + taxes;
};

const normalizeOffer = (flight) => {

    const supplierTotal =
        calculateSupplierTotal(flight);

    const serviceFee = 299;
    const discount = 200;

    const customerTotal =
        supplierTotal +
        serviceFee -
        discount;

    return {

        offerId:
            `${flight.supplier}-${flight.supplierResultId}`,

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
            flight.departure,

        arrival:
            flight.arrival,

        supplierBaseFare:
            Number(flight.baseFare),

        supplierTaxes:
            Number(flight.taxes),

        supplierTotal,

        serviceFee,

        discount,

        customerTotal,

        currency:
            "INR",

        baggage:
            flight.baggage,

        refundable:
            flight.refundable,

        fareFamily:
            flight.fareFamily || "ECONOMY",

        supplierMargin:
            flight.supplier === "TBO"
                ? 500
                : 300,

        reliabilityScore:
            flight.supplier === "TBO"
                ? 0.95
                : 0.92
    };
};

const saveOffer = async (offer) => {



    const savedOffer =
        await prisma.flightOffer.upsert({

            where: {
                offerId:
                    offer.offerId
            },

            update: {

                supplier:
                    offer.supplier,

                supplierResultId:
                    offer.supplierResultId,

                airlineCode:
                    offer.airlineCode,

                flightNumber:
                    offer.flightNumber,

                origin:
                    offer.origin,

                destination:
                    offer.destination,

                departure:
                    new Date(offer.departure),

                arrival:
                    new Date(offer.arrival),

                baggage:
                    offer.baggage,

                refundable:
                    offer.refundable,

                supplierBaseFare:
                    offer.supplierBaseFare,

                supplierTaxes:
                    offer.supplierTaxes,

                supplierTotal:
                    offer.supplierTotal,

                serviceFee:
                    offer.serviceFee,

                discount:
                    offer.discount,

                customerTotal:
                    offer.customerTotal,

                currency:
                    offer.currency
            },

            create: {

                offerId:
                    offer.offerId,

                supplier:
                    offer.supplier,

                supplierResultId:
                    offer.supplierResultId,

                airlineCode:
                    offer.airlineCode,

                flightNumber:
                    offer.flightNumber,

                origin:
                    offer.origin,

                destination:
                    offer.destination,

                departure:
                    new Date(offer.departure),

                arrival:
                    new Date(offer.arrival),

                baggage:
                    offer.baggage,

                refundable:
                    offer.refundable,

                supplierBaseFare:
                    offer.supplierBaseFare,

                supplierTaxes:
                    offer.supplierTaxes,

                supplierTotal:
                    offer.supplierTotal,

                serviceFee:
                    offer.serviceFee,

                discount:
                    offer.discount,

                customerTotal:
                    offer.customerTotal,

                currency:
                    offer.currency
            }
        });

    console.log(
        "Offer saved successfully:",
        savedOffer.offerId
    );

    return savedOffer;
};
const createItineraryKey = (offer) => {

    return [
        offer.airlineCode,
        offer.flightNumber,
        offer.origin,
        offer.destination,
        offer.departure,
        offer.arrival
    ].join("|");
};

const groupByItinerary = (offers) => {

    const groups = new Map();

    offers.forEach((offer) => {

        const key =
            createItineraryKey(offer);

        if (!groups.has(key)) {

            groups.set(
                key,
                []
            );
        }

        groups
            .get(key)
            .push(offer);
    });

    return Array.from(
        groups.values()
    );
};

const compareOffers = (offers) => {

    return [...offers].sort(
        (a, b) => {

            
            if (
                a.customerTotal !==
                b.customerTotal
            ) {

                return (
                    a.customerTotal -
                    b.customerTotal
                );
            }
            return (
                b.reliabilityScore -
                a.reliabilityScore
            );
        }
    );
};


/**
 * Search multiple suppliers
 */
const searchMultipleSuppliers = async (request) => {
        const cacheKey = flightSearchCacheKey(request);


    // -----------------------------------
    // 2. Check Redis
    // -----------------------------------

    const cachedResults = await getCache(cacheKey);

    if (cachedResults) {

        console.log(
            `Returning cached results: ${cacheKey}`
        );

        return cachedResults;
    }
    const supplierNames = supplierGateway.getSupplierNames();

    const results = await Promise.allSettled(
            supplierNames.map((supplier) => {
                    return supplierGateway
                        .searchFlights(
                            supplier,
                            request
                        );
                }
            )
        );
    const allOffers = [];


    results.forEach((result, index) => {
        const supplier =supplierNames[index];
            if ( result.status ==="fulfilled") {
                const flights =result.value || [];
                flights.forEach((flight) => {
                    const offer =normalizeOffer( flight);
                        allOffers.push(offer);
                    }
                );

            } else {
                console.error( `Supplier ${supplier} search failed:`,result.reason);
            }
        }
    );

    for (const offer of allOffers) {
        await saveOffer( offer);
    }
    const itineraryGroups =groupByItinerary(allOffers);
    const  response   =   itineraryGroups.map((offers) => {
            const sortedOffers =compareOffers(offers);
            const firstOffer =sortedOffers[0];
            return {
                itinerary:{
                    airlineCode:firstOffer.airlineCode,

                    flightNumber:firstOffer.flightNumber,

                    origin:firstOffer.origin,

                    destination:firstOffer.destination,

                    departure:firstOffer.departure,

                    arrival:firstOffer.arrival
                },

                offers:sortedOffers
            };
        }
    );

      await setCache(
        cacheKey,
        response,
        Number(
            process.env.REDIS_SEARCH_TTL || 300
        )
    );

    return response;
};


export default {

    searchMultipleSuppliers,

    normalizeOffer,

    saveOffer,

    groupByItinerary,

    compareOffers
};