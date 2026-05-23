import { pool } from "../..";
import type { Iuser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserintodb = async (payload: Iuser) => {
  const { name, email, password, age, role } = payload;

  const hashPassword = await bcrypt.hash(password, 15);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, age, role)
    VALUES ($1, $2, $3, $4, COALESCE($5, 'user'))
    RETURNING *
    `,
    [name, email, hashPassword, age, role]
  );

  delete result.rows[0].password;

  return result;
};

const getAllusersfromDb = async () => {
  const result = await pool.query(`
    SELECT * FROM users
  `);

  result.rows.forEach((user) => {
    delete user.password;
  });

  return result;
};

const getsingleuserfromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users WHERE id = $1
    `,
    [id]
  );

  if (result.rows.length > 0) {
    delete result.rows[0].password;
  }

  return result;
};

const UpdateuserfromDB = async (payload: Iuser, id: string) => {
  const { name, password, age, is_active, role } = payload;

  const hashPassword = password ? await bcrypt.hash(password, 15) : undefined;

  const result = await pool.query(
    `
    UPDATE users
    SET name = COALESCE($1, name),
        password = COALESCE($2, password),
        age = COALESCE($3, age),
        is_active = COALESCE($4, is_active),
        role = COALESCE($5, role),
        updated_at = NOW()
    WHERE id = $6
    RETURNING *
    `,
    [name, hashPassword, age, is_active, role, id]
  );

  if (result.rows.length > 0) {
    delete result.rows[0].password;
  }

  return result;
};

const userDeleteformDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM users 
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  if (result.rows.length > 0) {
    delete result.rows[0].password;
  }

  return result;
};

export const userService = {
  createUserintodb,
  getAllusersfromDb,
  getsingleuserfromDB,
  UpdateuserfromDB,
  userDeleteformDB,
};