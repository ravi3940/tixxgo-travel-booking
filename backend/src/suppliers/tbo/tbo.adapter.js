import SupplierAdapter from "../supplier.adapter.js";
import tboMock from "./tbo.mock.js";

class TboAdapter extends SupplierAdapter {

    async searchFlights(request) {
        return tboMock.searchFlights(request);
    }

    async bookFlight(request) {
        return tboMock.bookFlight(request);
    }

    async getBookingStatus(request) {
        return tboMock.getBookingStatus(
            request.supplierBookingReference
        );
    }

    async findBookingByResultId(request) {
        return tboMock.findBookingByResultId(
            request.supplierResultId
        );
    }

    async cancelBooking(request) {
        return tboMock.cancelBooking(
            request.supplierBookingReference
        );
    }
}

export default new TboAdapter();