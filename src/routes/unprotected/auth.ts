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

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             properties:
 *                 token:
 *                   type: string
 *                 email:
 *                    type: string
 *                 role:
 *                   type: string
 *                 name:
 *                  type: string
 */
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
    const token = createJWT(user);
    res.status(201).json({
      token: token,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 email:
 *                    type: string
 *                 role:
 *                   type: string
 *                 name:
 *                  type: string
 */
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
      res.status(401).json({ message: "invalid password" });
      return;
    }

    let tokenPayload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      name: user.name,
      pharmacy_id: null,
    };

    if (user.role === "pharmacy") {
      const pharmacy = await prisma.pharmacy.findUnique({
        where: {
          user_id: user.user_id,
        },
      });
      tokenPayload.pharmacy_id = pharmacy?.pharmacy_id;
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token: token,
      email: user.email,
      role: user.role,
      name: user.name,
      pharmacy_id: tokenPayload.pharmacy_id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
