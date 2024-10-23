import jwt from "jsonwebtoken";
import { prisma } from "../lib/db";
import {
  APIError,
  APIResponse,
  asyncResolver,
  uploadOnCloudinary,
} from "../utils";
import bcrypt from "bcryptjs";

export const OPTIONS = {
  httpOnly: true,
  secure: true,
};

export interface CreatedUser {
  username: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  avatar: string;
  gender: string;
  specification: string;
}

class UserService {
  private static generateAccessAndRefreshTokens(user: any) {
    try {
      const accessToken = jwt.sign(
        { _id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
      );
      const refreshToken = jwt.sign(
        { _id: user.id },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
      );
      return { accessToken, refreshToken };
    } catch (err: any) {
      throw new APIError(500, err?.message || "Internal Server Error");
    }
  }

  private static async hashPassword(
    password: string,
    saltRounds: number = 10,
  ): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Error hashing password");
    }
  }

  public static getAllUsers() {
    return prisma.users.findMany();
  }

  public static getUserById({ id }: { id: string }) {
    return prisma.users.findUnique({ where: { id } });
  }

  public static getUsersWhere({ where }: { where: any }) {
    return prisma.users.findMany({ where });
  }

  public static async createUser(payload: CreatedUser) {
    const { username, email, name, isAdmin, password } = payload;

    const user = await prisma.users.create({
      data: {
        name,
        email,
        username,
        isAdmin,
        password,
      },
    });
    return null;
  }
}

export default UserService;
