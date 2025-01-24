import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken, { protect } from "../../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// router.use((req, res, next) => authenticateToken(req, res, next));
// router.use(authenticateToken);
router.use(protect);
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

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

export default router;
