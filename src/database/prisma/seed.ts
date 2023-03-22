import { PrismaClient } from "@prisma/client";
import { UserI } from "../../interfaces";

const prisma: PrismaClient = new PrismaClient();

const users: UserI.UserCreateI[] = [
  {
    fname: "Mohammad",
    lname: "Foroutan",
    phone: "09121001001",
    birthday: new Date("1990-12-12"),
    password: "$2b$12$sut.VttuceVeq.vGKVI/VuPPdo8EccchK4w.Szd9bhxFtXQGcsgGa", //password
    role: "ADMIN",
  },
  {
    fname: "Amin",
    lname: "operator",
    phone: "09121001002",
    birthday: new Date("1992-01-17"),
    password: "$2b$12$sut.VttuceVeq.vGKVI/VuPPdo8EccchK4w.Szd9bhxFtXQGcsgGa", //password
    role: "OPERATOR",
  },
  {
    fname: "Raha",
    lname: "client",
    phone: "09121001003",
    birthday: new Date("1996-05-03"),
    password: "$2b$12$sut.VttuceVeq.vGKVI/VuPPdo8EccchK4w.Szd9bhxFtXQGcsgGa", //password
    role: "CLIENT",
  },
];

(async function main() {
  await prisma.user.createMany({
    data: users,
  });
})();
