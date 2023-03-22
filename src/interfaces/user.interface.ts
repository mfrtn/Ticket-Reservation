import { Role, User } from "../database";

type UserCreateI = {
  fname: string;
  lname: string;
  phone: string;
  nationalCode?: string;
  birthday: Date;
  password: string;
  avatarUrl?: string;
  role?: Role;
  ballance?: number;
};

type UserOutputI = {
  id: string;
  fname: string;
  lname: string;
  phone: string;
  nationalCode?: string;
  birthday: Date;
  // password: string;
  avatarUrl?: string;
  role?: Role;
  ballance?: number;
  createdAt: Date;
  updatedAt: Date;
};

interface UserI extends User {}

export { UserCreateI, UserOutputI, UserI };
