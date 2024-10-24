import jwt from "jsonwebtoken";
import { prisma } from "../lib/db";
import {
  APIError,
  APIResponse,
  asyncResolver,
  uploadOnCloudinary,
} from "../utils";
import bcrypt from "bcryptjs";
import { Gender, Specification } from "@prisma/client";

export const OPTIONS = {
  httpOnly: true,
  secure: true,
};

export interface CreatedUser {
  username: string;
  email: string;
  password: string;
  name: string;
  isAdmin: string;
  avatar: string;
  gender: string;
  specification: string;
}

class UserService {
  private static generateAccessAndRefreshTokens(user: any) {
    try {
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
      );
      const refreshToken = jwt.sign(
        { id: user.id },
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
    return prisma.user.findMany({
      include: {
        doctor: true,
        hospital: true,
      },
    });
  }

  public static getUserById({ id }: { id: string }) {
    return prisma.user.findUnique({
      where: { id },
      include: { doctor: true, hospital: true },
    });
  }

  public static registerUser = asyncResolver(async (req, res) => {
    const { username, email, name, isAdmin, password, gender, specification } =
      req.body as CreatedUser;

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
    if (userExists) {
      throw new APIError(400, "User already exists");
    }
    const avatar =
      (await uploadOnCloudinary((req.files as any)?.avatar[0]?.path as string))
        ?.url || "";
    const hashedPassword = await UserService.hashPassword(password);
    const user =
      isAdmin === "false"
        ? await prisma.user.create({
            data: {
              name,
              email,
              username,
              isAdmin: false,
              password: hashedPassword,
              avatar,
              doctor: {
                create: {
                  gender: gender.toUpperCase() as Gender,
                  specification: specification.toUpperCase() as Specification,
                },
              },
            },
          })
        : await prisma.user.create({
            data: {
              name,
              email,
              username,
              isAdmin: true,
              password: hashedPassword,
              avatar,
              hospital: {
                create: {},
              },
            },
          });
    if (!user) {
      throw new APIError(500, "Error creating user");
    }

    return res.status(201).json(
      new APIResponse(201, "User registered successfully", {
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      }),
    );
  });

  public static loginUser = asyncResolver(async (req, res) => {
    const { email, password } = req.body as any;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new APIError(404, "User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new APIError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken } =
      UserService.generateAccessAndRefreshTokens(user);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });
    return res
      .status(200)
      .cookie("accessToken", accessToken, OPTIONS)
      .cookie("refreshToken", refreshToken, OPTIONS)
      .json(
        new APIResponse(200, "User logged in successfully", {
          name: user.name,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
          accessToken: accessToken,
          refreshToken: refreshToken,
        }),
      );
  });

  public static logoutUser = asyncResolver(async (req, res) => {
    await prisma.user.update({
      where: {
        id: (req as any).user.id,
      },
      data: {
        refreshToken: null,
      },
    });
    return res
      .status(200)
      .clearCookie("accessToken", OPTIONS)
      .clearCookie("refreshToken", OPTIONS)
      .json(new APIResponse(200, "User logged out successfully"));
  });

  public static currentUser = asyncResolver(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: (req as any).user.id,
      },
    });
    if (!user) {
      throw new APIError(404, "User not found");
    }
    return res.status(200).json(
      new APIResponse(200, "User found", {
        name: user.name,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
      }),
    );
  });
}

export default UserService;
