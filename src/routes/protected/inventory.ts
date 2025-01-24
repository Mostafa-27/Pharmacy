import express from "express";
import * as inventoryController from "../../controllers/inventoryController";

const router = express.Router();

// Real-Time Stock Tracking
router.get("/stock", inventoryController.getStock);

// Stock Reordering
router.post("/reorder", inventoryController.reorderStock);

// Barcode Scanning
router.post("/barcode-scan", inventoryController.scanBarcode);

// Multi-Location Support
router.get("/locations", inventoryController.getLocations);

export default router;
