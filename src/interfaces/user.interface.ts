import { Role, User } from "../database";

type UserCreateI = {
  name: string;
  phone: string;
  password: string;
  role?: Role;
};

type UserOutputI = {
  id: number;
  name: string;
  phone: string;
  // password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

interface UserI extends User {}

export { UserCreateI, UserOutputI, UserI };
