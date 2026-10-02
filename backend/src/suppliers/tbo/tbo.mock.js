const mockFlights = [
    {
        supplier: "TBO",
        supplierResultId: "TBO001",
        airline: "AI",
        flightNumber: "AI482",
        origin: "AMD",
        destination: "DEL",
        departure: "2026-10-15T10:30:00",
        arrival: "2026-10-15T12:10:00",
        baseFare: 5200,
        taxes: 950,
        baggage: "15 KG",
        refundable: true,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO002",
        airline: "6E",
        flightNumber: "6E2345",
        origin: "AMD",
        destination: "DEL",
        departure: "2026-10-15T14:20:00",
        arrival: "2026-10-15T16:00:00",
        baseFare: 4600,
        taxes: 900,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO003",
        airline: "AI",
        flightNumber: "AI456",
        origin: "AMD",
        destination: "DEL",
        departure: "2026-10-15T18:30:00",
        arrival: "2026-10-15T20:15:00",
        baseFare: 5800,
        taxes: 1050,
        baggage: "20 KG",
        refundable: true,
        fareFamily: "PREMIUM_ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO004",
        airline: "6E",
        flightNumber: "6E2104",
        origin: "DEL",
        destination: "AMD",
        departure: "2026-10-15T07:30:00",
        arrival: "2026-10-15T09:15:00",
        baseFare: 4500,
        taxes: 850,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO005",
        airline: "AI",
        flightNumber: "AI531",
        origin: "DEL",
        destination: "AMD",
        departure: "2026-10-15T15:00:00",
        arrival: "2026-10-15T16:45:00",
        baseFare: 5300,
        taxes: 980,
        baggage: "15 KG",
        refundable: true,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO006",
        airline: "6E",
        flightNumber: "6E5234",
        origin: "AMD",
        destination: "BOM",
        departure: "2026-10-15T08:00:00",
        arrival: "2026-10-15T09:10:00",
        baseFare: 3200,
        taxes: 650,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO007",
        airline: "AI",
        flightNumber: "AI612",
        origin: "AMD",
        destination: "BOM",
        departure: "2026-10-15T17:30:00",
        arrival: "2026-10-15T18:40:00",
        baseFare: 3900,
        taxes: 720,
        baggage: "20 KG",
        refundable: true,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO008",
        airline: "6E",
        flightNumber: "6E5312",
        origin: "BOM",
        destination: "AMD",
        departure: "2026-10-15T09:30:00",
        arrival: "2026-10-15T10:40:00",
        baseFare: 3100,
        taxes: 620,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO009",
        airline: "6E",
        flightNumber: "6E2018",
        origin: "DEL",
        destination: "BOM",
        departure: "2026-10-15T06:30:00",
        arrival: "2026-10-15T08:45:00",
        baseFare: 4800,
        taxes: 900,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO010",
        airline: "AI",
        flightNumber: "AI865",
        origin: "DEL",
        destination: "BOM",
        departure: "2026-10-15T19:00:00",
        arrival: "2026-10-15T21:10:00",
        baseFare: 5600,
        taxes: 1000,
        baggage: "20 KG",
        refundable: true,
        fareFamily: "ECONOMY"
    },
    {
        supplier: "TBO",
        supplierResultId: "TBO011",
        airline: "6E",
        flightNumber: "6E2205",
        origin: "BOM",
        destination: "DEL",
        departure: "2026-10-15T11:00:00",
        arrival: "2026-10-15T13:10:00",
        baseFare: 4700,
        taxes: 880,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO012",
        airline: "6E",
        flightNumber: "6E308",
        origin: "DEL",
        destination: "BLR",
        departure: "2026-10-15T07:00:00",
        arrival: "2026-10-15T09:45:00",
        baseFare: 6500,
        taxes: 1200,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO013",
        airline: "AI",
        flightNumber: "AI803",
        origin: "DEL",
        destination: "BLR",
        departure: "2026-10-15T18:00:00",
        arrival: "2026-10-15T20:45:00",
        baseFare: 7200,
        taxes: 1300,
        baggage: "20 KG",
        refundable: true,
        fareFamily: "ECONOMY"
    },
    {
        supplier: "TBO",
        supplierResultId: "TBO014",
        airline: "6E",
        flightNumber: "6E309",
        origin: "BLR",
        destination: "DEL",
        departure: "2026-10-15T10:00:00",
        arrival: "2026-10-15T12:45:00",
        baseFare: 6400,
        taxes: 1150,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO015",
        airline: "6E",
        flightNumber: "6E203",
        origin: "DEL",
        destination: "HYD",
        departure: "2026-10-15T09:00:00",
        arrival: "2026-10-15T11:15:00",
        baseFare: 5200,
        taxes: 950,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },
    {
        supplier: "TBO",
        supplierResultId: "TBO016",
        airline: "AI",
        flightNumber: "AI542",
        origin: "HYD",
        destination: "DEL",
        departure: "2026-10-15T13:00:00",
        arrival: "2026-10-15T15:20:00",
        baseFare: 5500,
        taxes: 1000,
        baggage: "20 KG",
        refundable: true,
        fareFamily: "ECONOMY"
    },
    {
        supplier: "TBO",
        supplierResultId: "TBO017",
        airline: "6E",
        flightNumber: "6E521",
        origin: "BOM",
        destination: "BLR",
        departure: "2026-10-15T08:45:00",
        arrival: "2026-10-15T10:25:00",
        baseFare: 4200,
        taxes: 800,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },
    {
        supplier: "TBO",
        supplierResultId: "TBO018",
        airline: "6E",
        flightNumber: "6E692",
        origin: "BLR",
        destination: "HYD",
        departure: "2026-10-15T12:00:00",
        arrival: "2026-10-15T13:15:00",
        baseFare: 3500,
        taxes: 700,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },
    {
        supplier: "TBO",
        supplierResultId: "TBO019",
        airline: "6E",
        flightNumber: "6E6012",
        origin: "MAA",
        destination: "BLR",
        departure: "2026-10-15T09:30:00",
        arrival: "2026-10-15T10:30:00",
        baseFare: 2800,
        taxes: 600,
        baggage: "15 KG",
        refundable: false,
        fareFamily: "ECONOMY"
    },

    {
        supplier: "TBO",
        supplierResultId: "TBO020",
        airline: "AI",
        flightNumber: "AI563",
        origin: "BLR",
        destination: "MAA",
        departure: "2026-10-15T16:00:00",
        arrival: "2026-10-15T17:00:00",
        baseFare: 3000,
        taxes: 620,
        baggage: "20 KG",
        refundable: true,
        fareFamily: "ECONOMY"
    }

];




const supplierBookings = new Map();




// const searchFlights = async (request) => {

//     const {
//         origin,
//         destination,
//         departureDate
//     } = request;

//     return mockFlights.filter((flight) =>
//         flight.origin === origin &&
//         flight.destination === destination &&
//         flight.departure.startsWith(
//             departureDate
//         )
//     );
// };
const searchFlights = async (request) => {

    const {
        origin,
        destination,
        departureDate
    } = request;

    return mockFlights.filter((flight) => {

        return (
            flight.origin === origin &&
            flight.destination === destination &&
            flight.departure.startsWith(departureDate)
        );

    });
};

const bookFlight = async (request) => {

    const {
        supplierResultId,
        traveller,
        simulation = "SUCCESS"
    } = request;


    // ----------------------------------------------
    // SUCCESS
    // ----------------------------------------------

    if (simulation === "SUCCESS") {

        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        const supplierBookingReference =
            `TBO-PNR-${Date.now()}`;

        const ticketNumber =
            `TKT-${Date.now()}`;


        // Store booking at supplier
        supplierBookings.set(
            supplierBookingReference,
            {
                supplierBookingReference,
                supplierResultId,
                status: "CONFIRMED",
                ticketNumber,
                traveller
            }
        );


        return {
            success: true,
            supplier: "TBO",
            supplierResultId,

            supplierBookingReference,

            status: "CONFIRMED",

            ticketNumber,

            traveller: {
                firstName:
                    traveller.firstName,

                lastName:
                    traveller.lastName
            }
        };
    }


    // ----------------------------------------------
    // FAILURE
    // ----------------------------------------------

    if (simulation === "FAILURE") {

        return {
            success: false,
            supplier: "TBO",
            supplierResultId,
            status: "FAILED",
            message:
                "Supplier booking failed"
        };
    }


    // ----------------------------------------------
    // TIMEOUT
    // ----------------------------------------------

    if (simulation === "TIMEOUT") {

        // Important:
        // TBO actually creates the booking first.
        // But Tixxgo will not receive the response.

        const supplierBookingReference =
            `TBO-PNR-${Date.now()}`;

        const ticketNumber =
            `TKT-${Date.now()}`;


        // Save the booking inside
        // the mock supplier.

        supplierBookings.set(
            supplierBookingReference,
            {
                supplierBookingReference,

                supplierResultId,

                status: "CONFIRMED",

                ticketNumber,

                traveller
            }
        );


        // Simulate network timeout

        await new Promise((resolve) => {
            setTimeout(resolve, 3000);
        });


        const error = new Error(
            "Supplier request timed out"
        );

        error.code =
            "SUPPLIER_TIMEOUT";

        throw error;
    }


    // ----------------------------------------------
    // INVALID SIMULATION
    // ----------------------------------------------

    throw new Error(
        `Unknown supplier simulation: ${simulation}`
    );
};


const getBookingStatus = async (
    supplierBookingReference
) => {

    await new Promise((resolve) => {
        setTimeout(resolve, 300);
    });


    if (!supplierBookingReference) {

        return {
            success: false,
            status: "NOT_FOUND"
        };
    }


    const booking =
        supplierBookings.get(
            supplierBookingReference
        );


    if (!booking) {

        return {
            success: false,
            status: "NOT_FOUND"
        };
    }


    return {
        success: true,

        status:
            booking.status,

        supplier: "TBO",

        supplierBookingReference:
            booking.supplierBookingReference,

        ticketNumber:
            booking.ticketNumber
    };
};


const findBookingByResultId = async (
    supplierResultId
) => {

    await new Promise((resolve) => {
        setTimeout(resolve, 300);
    });

    for (const booking of supplierBookings.values()) {

        if (
            booking.supplierResultId ===
            supplierResultId
        ) {

            return {
                success: true,

                status:
                    booking.status,

                supplier:
                    "TBO",

                supplierBookingReference:
                    booking.supplierBookingReference,

                ticketNumber:
                    booking.ticketNumber
            };
        }
    }

    return {
        success: false,
        status: "NOT_FOUND"
    };
};

const cancelBooking = async (supplierBookingReference) => {

    const booking =
        supplierBookings.get(supplierBookingReference);

    if (!booking) {
        return {
            success: false,
            status: "NOT_FOUND"
        };
    }

    booking.status = "CANCELLED";

    supplierBookings.set(
        supplierBookingReference,
        booking
    );

    return {
        success: true,
        status: "CANCELLED",
        supplierBookingReference
    };
};

export default {
    searchFlights,
    bookFlight,
    getBookingStatus ,
    findBookingByResultId,
    cancelBooking
};