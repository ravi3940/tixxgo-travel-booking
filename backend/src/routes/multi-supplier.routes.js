import express from "express";

import {
    searchMultipleSuppliers
} from "../controllers/multi-supplier.controller.js";

const router = express.Router();

router.post(
    "/search",
    searchMultipleSuppliers
);

export default router;