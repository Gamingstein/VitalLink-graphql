import jwt from "jsonwebtoken";
import { APIError, asyncResolver } from "../utils";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/db";

export const authMiddleware = asyncResolver(
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
      if (!token) {
        throw new APIError(401, "Unauthorized: Missing token.");
      }
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      );
      const { id } = decodedToken as {
        id: string;
        email: string;
        isAdmin: string;
      };
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          isAdmin: true,
          password: false,
          refreshToken: false,
        },
      });
      if (!user) {
        throw new APIError(401, "Unauthorized: User not found.");
      }
      //ts-ignore
      (req as any).user = user;
      next();
    } catch (err: any) {
      throw new APIError(401, err?.message || "Unauthorized: Invalid token.");
    }
  },
);
export const doctorAuthMiddleware = asyncResolver(
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
      if (!token) {
        throw new APIError(401, "Unauthorized: Missing token.");
      }
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      );
      const { id, isAdmin } = decodedToken as {
        id: string;
        email: string;
        isAdmin: string;
      };
      if (isAdmin === "true") {
        throw new APIError(401, "Unauthorized: User is not a doctor.");
      }
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          isAdmin: true,
          doctor: true,
          password: false,
          refreshToken: false,
        },
      });
      if (!user) {
        throw new APIError(401, "Unauthorized: User not found.");
      }
      (req as any).user = user;
      next();
    } catch (err: any) {
      throw new APIError(401, err?.message || "Unauthorized: Invalid token.");
    }
  },
);
export const hospitalAuthMiddleware = asyncResolver(
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
      if (!token) {
        throw new APIError(401, "Unauthorized: Missing token.");
      }
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      );
      const { id, isAdmin } = decodedToken as {
        id: string;
        email: string;
        isAdmin: string;
      };
      if (isAdmin === "false") {
        throw new APIError(401, "Unauthorized: User is not a hospital.");
      }
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          isAdmin: true,
          hospital: true,
          password: false,
          refreshToken: false,
        },
      });
      if (!user) {
        throw new APIError(401, "Unauthorized: User not found.");
      }
      (req as any).user = user;
      next();
    } catch (err: any) {
      throw new APIError(401, err?.message || "Unauthorized: Invalid token.");
    }
  },
);
