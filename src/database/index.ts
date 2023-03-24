import { PrismaClient, Role, Status, User, Transaction } from "@prisma/client";

const db = new PrismaClient();

export { db, Role, Status, User, Transaction };
