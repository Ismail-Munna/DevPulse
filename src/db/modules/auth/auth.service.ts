import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../..";
import config from "../../../config";
import type { ROLES } from "../../../types";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role?: ROLES;
}

interface LoginPayload {
  email: string;
  password: string;
}

const signupUserintoDB = async (payload: SignupPayload) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new Error("name, email and password are required");
  }

  if (role && role !== "contributor" && role !== "maintainer") {
    throw new Error("role must be contributor or maintainer");
  }

  const existingUser = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashPassword, role]
  );

  return result.rows[0];
};

const loginUserintoDB = async (payload: LoginPayload) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("email and password are required");
  }

  const userdata = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email]
  );

  if (userdata.rows.length === 0) {
    throw new Error("invalid credential");
  }

  const user = userdata.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("invalid credential");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtpayload, config.secret, {
    expiresIn: "1d",
  });

  delete user.password;

  return {
    token,
    user,
  };
};

export const authservice = {
  signupUserintoDB,
  loginUserintoDB,
};