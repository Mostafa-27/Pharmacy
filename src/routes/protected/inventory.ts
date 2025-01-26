import express from "express";
import * as inventoryController from "../../controllers/inventoryController";

const router = express.Router();

/**
 * @swagger
 * /inventory/stock:
 *   get:
 *     summary: Retrieve the stock information
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Stock information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stock:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PharmacyInventory'
 */
router.get("/stock", inventoryController.getStock);

/**
 * @swagger
 * /inventory/reorder:
 *   post:
 *     summary: Reorder stock
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pharmacy_id:
 *                 type: integer
 *               medicine_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reorder successful
 */
router.post("/reorder", inventoryController.reorderStock);

/**
 * @swagger
 * /inventory/barcode-scan:
 *   post:
 *     summary: Scan a barcode
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Barcode scan successful
 */
router.post("/barcode-scan", inventoryController.scanBarcode);

/**
 * @swagger
 * /inventory/locations:
 *   get:
 *     summary: Retrieve the locations
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Locations information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get("/locations", inventoryController.getLocations);

export default router;
