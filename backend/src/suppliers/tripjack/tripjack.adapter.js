import SupplierAdapter from "../supplier.adapter.js";
import tripJackMock from "./tripjack.mock.js";

class TripJackAdapter extends SupplierAdapter {

    async searchFlights(request) {
        return tripJackMock.searchFlights(request);
    }

    async bookFlight(request) {
        throw new Error(
            "TripJack booking is not implemented in this assessment"
        );
    }

    async getBookingStatus(request) {
        throw new Error(
            "TripJack booking status is not implemented"
        );
    }

    async findBookingByResultId(request) {
        throw new Error(
            "TripJack booking lookup is not implemented"
        );
    }

    async cancelBooking(request) {
        throw new Error(
            "TripJack cancellation is not implemented"
        );
    }
}

export default new TripJackAdapter();