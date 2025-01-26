import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken, { protect } from "../../middleware/authMiddleware";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /searchHistory:
 *   get:
 *     summary: Retrieve a list of search histories
 *     tags: [SearchHistory]
 *     responses:
 *       200:
 *         description: A list of search histories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchHistory'
 */
router.get("/", protect, async (req, res) => {
  const searchHistories = await prisma.searchHistory.findMany();
  res.json(searchHistories);
});

export default router;
