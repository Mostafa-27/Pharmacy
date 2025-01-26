// src/server.ts

import express from "express";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/unprotected/auth";
import categoryRoutes from "./routes/protected/categories";
import authenticateToken from "./middleware/authMiddleware";
import medicineRoutes from "./routes/protected/medicines";
// import orderRoutes from "./routes/protected/orders";
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
app.use("/categories", categoryRoutes);
app.use("/medicines", medicineRoutes);
// app.use("/orders", orderRoutes);
app.use("/pharmacies", pharmacyRoutes);
app.use("/reviews", reviewRoutes);
app.use("/search-history", searchHistoryRoutes);
app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
