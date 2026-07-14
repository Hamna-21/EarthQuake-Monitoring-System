import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt";

export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token missing" });
  }

  jwt.verify(token, getJwtSecret(), (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired session token" });
    }
    req.user = decoded;
    next();
  });
};
