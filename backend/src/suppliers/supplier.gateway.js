import tboAdapter from "./tbo/tbo.adapter.js";
import tripJackAdapter from "./tripjack/tripjack.adapter.js";

const suppliers = {
    TBO: tboAdapter,
    TRIPJACK: tripJackAdapter
};

class SupplierGateway {

    getSupplier(supplier) {

        const adapter = suppliers[supplier];

        if (!adapter) {
            throw new Error(
                `Supplier ${supplier} is not configured`
            );
        }

        return adapter;
    }

    getSupplierNames() {
        return Object.keys(suppliers);
    }

    async searchFlights(supplier, request) {
        return this
            .getSupplier(supplier)
            .searchFlights(request);
    }

    async bookFlight(supplier, request) {
        return this
            .getSupplier(supplier)
            .bookFlight(request);
    }

    async getBookingStatus(supplier, request) {
        return this
            .getSupplier(supplier)
            .getBookingStatus(request);
    }

    async findBookingByResultId(supplier, request) {
        return this
            .getSupplier(supplier)
            .findBookingByResultId(request);
    }

    async cancelBooking(supplier, request) {
        return this
            .getSupplier(supplier)
            .cancelBooking(request);
    }
}

export default new SupplierGateway();