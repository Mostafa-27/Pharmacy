// src/server.ts

import express from "express";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/unprotected/auth";
import categoryRoutes from "./routes/protected/categories";
import authenticateToken, { protect } from "./middleware/authMiddleware";
import medicineRoutes from "./routes/protected/medicines";
import inventoryRoutes from "./routes/protected/inventory";
import pharmacyRoutes from "./routes/protected/pharmacies";
import reviewRoutes from "./routes/protected/reviews";
import searchHistoryRoutes from "./routes/protected/searchHistory";
import userRoutes from "./routes/protected/users";
import notificationRoutes from "./routes/protected/notifications";

const app = express();
const prisma = new PrismaClient();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/categories", protect, categoryRoutes);
app.use("/medicines", protect, medicineRoutes);
app.use("/inventory", protect, inventoryRoutes);
app.use("/pharmacies", protect, pharmacyRoutes);
app.use("/reviews", protect, reviewRoutes);
app.use("/search-history", protect, searchHistoryRoutes);
app.use("/users", protect, userRoutes);
app.use("/notifications", protect, notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
