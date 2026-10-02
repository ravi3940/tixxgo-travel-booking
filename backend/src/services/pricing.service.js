const calculatePricing = ({ baseFare, taxes }) => {

    const serviceFee = 299;
    const discount = 200;

    const supplierTotal = baseFare + taxes;

    const customerTotal =
        supplierTotal +
        serviceFee -
        discount;

    return {
        supplierBaseFare: baseFare,
        supplierTaxes: taxes,
        supplierTotal,
        serviceFee,
        discount,
        customerTotal,
        currency: "INR"
    };
};

export default {
    calculatePricing
};