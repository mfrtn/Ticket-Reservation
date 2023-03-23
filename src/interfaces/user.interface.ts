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
};

type UserUpdateI = {
  fname?: string;
  lname?: string;
  phone?: string;
  nationalCode?: string;
  birthday?: Date;
  password?: string;
  avatarUrl?: string;
  role?: Role;
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

export { UserCreateI, UserOutputI, UserUpdateI, UserI };
