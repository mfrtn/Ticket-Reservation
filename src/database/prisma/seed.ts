import { PrismaClient } from "@prisma/client";
import { UserCreateI } from "../../interfaces/user.interface";

const prisma: PrismaClient = new PrismaClient();

const users: UserCreateI[] = [
  {
    name: "ADMIN",
    phone: "09121001001",
    password: "$2b$12$sut.VttuceVeq.vGKVI/VuPPdo8EccchK4w.Szd9bhxFtXQGcsgGa", //password
    role: "ADMIN",
  },
  {
    name: "OPERATOR",
    phone: "09121001002",
    password: "$2b$12$sut.VttuceVeq.vGKVI/VuPPdo8EccchK4w.Szd9bhxFtXQGcsgGa", //password
    role: "OPERATOR",
  },
  {
    name: "CLIENT",
    phone: "09121001003",
    password: "$2b$12$sut.VttuceVeq.vGKVI/VuPPdo8EccchK4w.Szd9bhxFtXQGcsgGa", //password
    role: "CLIENT",
  },
];

(async function main() {
  await prisma.user.createMany({
    data: users,
  });
})();
