import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken, { protect } from "../../middleware/authMiddleware";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", protect, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;
