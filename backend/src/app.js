import express from "express";
import cors from "cors";

import flightRoutes from "./routes/flight.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import cancellationRoutes from "./routes/cancellation.routes.js";
import multiSupplierRoutes from "./routes/multi-supplier.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Tixxgo backend is running"
    });
});

app.use("/api/flights", flightRoutes);

app.use("/api/bookings", bookingRoutes);

app.use(
    "/api/bookings",
    cancellationRoutes
);
app.use(
    "/api/suppliers",
    multiSupplierRoutes
);
export default app;