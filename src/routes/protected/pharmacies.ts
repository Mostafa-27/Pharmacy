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

/**
 * @swagger
 * /pharmacies:
 *   post:
 *     summary: Add a new pharmacy
 *     tags: [Pharmacies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pharmacy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pharmacy'
 */
router.post("/", protect, async (req, res) => {
  const { name, address, phone_number, location } = req.body;
  console.log(req.user.id);

  // Check if the user's role is "pharmacy"
  const user = await prisma.user.findUnique({
    where: { user_id: req.user.id },
  });

  if (user.role !== "pharmacy") {
    res
      .status(403)
      .json({ error: "User does not have premession to create pharmacy " });
    return;
  }

  // Check if the user already has other pharmacies
  const existingPharmacy = await prisma.pharmacy.findFirst({
    where: { user_id: req.user.id },
  });

  if (existingPharmacy) {
    res.status(403).json({ error: "User already has a pharmacy" });
    return;
  }
  try {
    const newPharmacy = await prisma.pharmacy.create({
      data: {
        user_id: req.user.id,
        name,
        address,
        phone_number,
        location,
      },
    });
    res.status(201).json(newPharmacy);
  } catch (error) {
    res.status(400).json({ error: "Failed to create pharmacy" });
  }
});

export default router;
