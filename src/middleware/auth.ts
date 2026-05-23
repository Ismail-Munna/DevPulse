import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { CustomJwtPayload, ROLES } from "../types";

const auth =
  (...roles: ROLES[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          errors: "Token is missing",
        });
        return;
      }

      const decoded = jwt.verify(token, config.secret) as CustomJwtPayload;

      const userdata = await pool.query(
        `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        WHERE id = $1
        `,
        [decoded.id]
      );

      if (userdata.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
          errors: "Invalid user",
        });
        return;
      }

      const user = userdata.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden",
          errors: "This role has no access",
        });
        return;
      }

      req.user = decoded;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
        errors: error,
      });
    }
  };

export default auth;