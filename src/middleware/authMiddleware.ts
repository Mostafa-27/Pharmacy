import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
export default authenticateToken;
export const comparePassword = (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 5);
};

export const createJWT = (user: { id: number; username: string }): string => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string
  );
  console.log("token", token);
  return token;
};

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    console.log("token not found");
    res.status(401).json({ message: "token not found" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = user;
    next();
  } catch (error) {
    console.log("error", error);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
