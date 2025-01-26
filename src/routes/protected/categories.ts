import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken, { protect } from "../../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

router.use(protect);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });
  res.json(category);
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

export default router;
