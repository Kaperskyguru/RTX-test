// const jwt = require("jsonwebtoken");
import { hashPassword, comparePassword } from "../../helpers/passwords.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class AuthController {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async register(req, res) {
    try {
      // Store all in User table
      req.body.password = await hashPassword(req.body.password);

      const result = await prisma.user.create(req.body);

      // result["password"] = null;
      return res.status(201).json({
        success: true,
        message: "New user created successfully",
        user: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error Occurred, Please try again",
      });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user && !(await comparePassword(password, user.password))) {
        return res.status(401).json({
          success: false,
          msg: "Password/email combination is incorrect",
        });
      }

      const expiresIn = "1h";
      let payload = {
        id: user.id,
      };
      let token = jwt.sign(payload, process.env.SECRET, { expiresIn });

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: user,
        token: token,
        tokenType: "Bearer ",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error Occurred, Please try again",
      });
    }
  }
}

export default AuthController;
