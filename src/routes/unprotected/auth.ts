import { Router } from "express";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  comparePassword,
  createJWT,
  hashPassword,
} from "../../middleware/authMiddleware";
const router = Router();
const prisma = new PrismaClient();

router.post("/signup", async (req, res) => {
  const { email, password, name, role, phone_number, location } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        role: role,
        phone_number: phone_number,
        location: location,
        password_hash: await hashPassword(password),
      },
    });
    const token = createJWT({ id: user.user_id, username: user.email });
    res.status(201).json({ token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(401).json({ message: "user not found" });
      return;
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      res
        .status(401)
        .json({ message: "invalid password" + user.password_hash });
      return;
    }

    const token = createJWT({ id: user.user_id, username: user.email });
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
