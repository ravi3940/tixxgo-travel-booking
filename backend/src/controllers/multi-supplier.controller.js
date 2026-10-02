import multiSupplierService
    from "../services/multi-supplier.service.js";

export const searchMultipleSuppliers = async (req, res) => {

    try {

        const result =
            await multiSupplierService
                .searchMultipleSuppliers(req.body);

        return res.status(200).json({
            success: true,
            message:
                "Multi-supplier flight search completed",
            data: result
        });

    } catch (error) {

        console.error(
            "Multi-supplier search error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Multi-supplier search failed"
        });
    }
};