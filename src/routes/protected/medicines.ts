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

/**
 * @swagger
 * /medicines:
 *   post:
 *     summary: Add a new medicine
 *     tags: [Medicines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               active_substance:
 *                 type: string
 *               description:
 *                 type: string
 *               uses:
 *                 type: string
 *               company_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Medicine added
 */
router.post("/", protect, async (req, res) => {
  const { name, active_substance, description, uses, company_id } = req.body;

  try {
    const newMedicine = await prisma.medicine.create({
      data: {
        name,
        active_substance,
        description,
        uses,
        company_id,
      },
    });

    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
