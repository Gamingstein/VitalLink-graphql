import { db } from "../lib/db";
import jwt from "jsonwebtoken";
import { createHmac, randomBytes } from "crypto";

export interface CreatedUser {
  username: string;
  password: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
}

class UserService {
  public static test() {
    return "Hello, world!";
  }
}

export default UserService;
