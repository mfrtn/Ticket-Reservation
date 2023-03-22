import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

import { UserOutputI } from "./user.interface";

interface JwtI extends JwtPayload {
  phone: string;
}

interface AuthRequestI extends Request {
  user?: UserOutputI;
}

type login = {
  phone: string;
  password: string;
};

export { JwtI, AuthRequestI, login };
