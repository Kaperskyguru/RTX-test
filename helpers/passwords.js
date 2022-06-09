import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

/**
 * Uses `bcrypt` to hash the provided password using the pre-configured salt rounds.
 * @param password The plain text password to be hashed.
 * @returns A promise to be either resolved with the encrypted password or rejected with an `Error`.
 */

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  return bcrypt.hash(password, salt);
};

/**
 * Uses `bcrypt` to compare a plain text password with an already hashed one.
 * @param password The plain text password to be compared.
 * @param hashed The hashed password already created in the past.
 * @returns A promise to be either resolved with the comparison result or rejected with an `Error`.
 */
export const comparePassword = async ({ password, hashed }) => {
  return bcrypt.compare(password, hashed);
};
