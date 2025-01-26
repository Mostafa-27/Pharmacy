import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken, { protect } from "../../middleware/authMiddleware";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /pharmacies:
 *   get:
 *     summary: Retrieve a list of pharmacies
 *     tags: [Pharmacies]
 *     responses:
 *       200:
 *         description: A list of pharmacies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pharmacy'
 */
router.get("/", protect, async (req, res) => {
  const pharmacies = await prisma.pharmacy.findMany();
  res.json(pharmacies);
});

export default router;
