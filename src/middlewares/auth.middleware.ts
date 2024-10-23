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
      const { _id } = decodedToken as { _id: string };
      const user = await prisma.users.findUnique({
        where: {
          id: _id,
        },
        select: {
          password: false,
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
