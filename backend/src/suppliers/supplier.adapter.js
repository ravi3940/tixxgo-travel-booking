class SupplierAdapter {

    async searchFlights(request) {
        throw new Error("searchFlights() must be implemented");
    }

    async bookFlight(request) {
        throw new Error("bookFlight() must be implemented");
    }

    async getBookingStatus(request) {
        throw new Error("getBookingStatus() must be implemented");
    }

    async findBookingByResultId(request) {
        throw new Error(
            "findBookingByResultId() must be implemented"
        );
    }

    async cancelBooking(request) {
        throw new Error(
            "cancelBooking() must be implemented"
        );
    }
}

export default SupplierAdapter;