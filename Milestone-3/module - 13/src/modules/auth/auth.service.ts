import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (email: string, password: string) => {
  console.log({ email });
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  console.log({ result });
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  console.log({ match, user });
  if (!match) {
    return false;
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );
  console.log({ token });

  return { token, user };
};

const signupUser = async (name: string, email: string, password: string) => {
  // Check if user already exists
  const existingUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists with this email");
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user (default role is 'user')
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
    [name, email, hashedPassword, 'user']
  );

  const newUser = result.rows[0];

  // Generate token for the new user
  const token = jwt.sign(
    { name: newUser.name, email: newUser.email, role: newUser.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  return { token, user: newUser };
};

export const authServices = {
  loginUser,
  signupUser,
};
