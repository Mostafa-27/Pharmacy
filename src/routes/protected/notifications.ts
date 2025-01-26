import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken, { protect } from "../../middleware/authMiddleware";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieve a list of notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get("/", protect, async (req, res) => {
  const notifications = await prisma.notification.findMany();
  res.json(notifications);
});

export default router;
