import { Router } from "express";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = Router();
const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
  const { email, password, name, role, phone_number, location } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password_hash,
      name,
      role,
      phone_number,
      location,
    },
  });
  res.json(user);
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  const token = jwt.sign(
    { userId: user.user_id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

export default router;
