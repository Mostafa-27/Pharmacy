import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken, { protect } from "../../middleware/authMiddleware";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /medicines:
 *   get:
 *     summary: Retrieve a list of medicines
 *     tags: [Medicines]
 *     responses:
 *       200:
 *         description: A list of medicines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Medicine'
 */
router.get("/", protect, async (req, res) => {
  const medicines = await prisma.medicine.findMany();
  res.json(medicines);
});

export default router;
