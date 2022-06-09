import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
let JWTOptions = {};

JWTOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
JWTOptions.secretOrKey = process.env.SECRET;

const Strategy = new JWTStrategy(JWTOptions, async (JWTPayloads, next) => {
  try {
    let user = await prisma.user.findUnique({ where: { id: JWTPayloads.id } });
    // console.log(user);
    if (user) return next(null, user);
    return next(null, false);
  } catch (error) {
    return next(error, false);
  }
});

export default Strategy;
