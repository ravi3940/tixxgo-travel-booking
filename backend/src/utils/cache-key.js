export const flightSearchCacheKey = ({
    origin,
    destination,
    departureDate,
    adults = 1,
    cabinClass = "ECONOMY"
}) => {

    return [
        "flight-search",
        origin.toUpperCase(),
        destination.toUpperCase(),
        departureDate,
        adults,
        cabinClass.toUpperCase()
    ].join(":");
};