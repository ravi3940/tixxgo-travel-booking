const mockFlights = [
    {
        supplier: "TRIPJACK",
        supplierResultId: "TJ001",
        airline: "AI",
        flightNumber: "AI101",
        origin: "AMD",
        destination: "DEL",
        departure: "2026-10-15T10:30:00",
        arrival: "2026-10-15T12:10:00",
        baseFare: 6800,
        taxes: 1350,
        baggage: "15 KG",
        refundable: true,
        fareFamily: "ECONOMY"
    } ,
        {
        supplier: "TRIPJACK",
        supplierResultId: "TJ001",
        airline: "AI",
        flightNumber: "AI102",
        origin: "DEL",
        destination:  "AMD",
        departure: "2026-10-15T10:30:00",
        arrival: "2026-10-15T12:10:00",
        baseFare: 6800,
        taxes: 1350,
        baggage: "15 KG",
        refundable: true,
        fareFamily: "ECONOMY"
    }
];

const searchFlights = async (request) => {
    const {
        origin,
        destination,
        departureDate
    } = request;

    return mockFlights.filter((flight) =>
        flight.origin === origin &&
        flight.destination === destination &&
        flight.departure.startsWith(departureDate)
    );
};

export default {
    searchFlights
};