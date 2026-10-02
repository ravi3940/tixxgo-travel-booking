const createItineraryKey = (flight) => {
    return [
        flight.airlineCode || flight.airline,
        flight.flightNumber,
        flight.origin,
        flight.destination,
        flight.departure,
        flight.arrival
    ]
        .join("|")
        .toUpperCase();
};

const groupDuplicateItineraries = (flights) => {

    const groups = new Map();

    for (const flight of flights) {

        const key = createItineraryKey(flight);

        if (!groups.has(key)) {
            groups.set(key, []);
        }

        groups.get(key).push(flight);
    }

    return Array.from(groups.values());
};
const compareOffers = (offers) => {

    return [...offers].sort((a, b) => {

        // Primary comparison: customer price
        if (a.customerTotal !== b.customerTotal) {
            return a.customerTotal - b.customerTotal;
        }

        // Same price: prefer refundable fare
        if (a.refundable !== b.refundable) {
            return a.refundable ? -1 : 1;
        }

        // Same refundability: more baggage
        if (a.baggage !== b.baggage) {
            return String(b.baggage)
                .localeCompare(String(a.baggage));
        }

        // Same commercial conditions:
        // prefer higher supplier reliability
        return (
            (b.reliabilityScore || 0) -
            (a.reliabilityScore || 0)
        );
    });
};
export default {
    createItineraryKey,
    groupDuplicateItineraries,
    compareOffers
};