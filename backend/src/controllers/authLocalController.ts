import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../repositories/userRepository';
import { getJwtSecret } from '../config/jwt';
import { User } from '../types/user';

export const register = async (req: Request, res: Response) => {
  const { email, password, name, country, organization } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required profile fields" });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Coordinates email already registered" });
    }

    const newUser: User = {
      email,
      password,
      name,
      country: country || "Pakistan",
      organization: organization || "",
      authProvider: "local",
      createdAt: new Date()
    };

    await createUser(newUser);

    const token = jwt.sign(
      { email: newUser.email, name: newUser.name, country: newUser.country },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        email: newUser.email,
        name: newUser.name,
        country: newUser.country,
        organization: newUser.organization,
        authProvider: newUser.authProvider
      }
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Tectonic server error during coordinate entry" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and passphrase are required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || user.authProvider !== "local" || user.password !== password) {
      return res.status(401).json({ error: "Invalid security credentials" });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, country: user.country },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        country: user.country,
        organization: user.organization,
        authProvider: user.authProvider
      }
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error verifying credentials" });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: "User session not found" });
    }

    res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        country: user.country,
        organization: user.organization,
        authProvider: user.authProvider
      }
    });
  } catch (err: any) {
    console.error("Auth verification error:", err);
    res.status(500).json({ error: "Failed to retrieve verified session" });
  }
};
