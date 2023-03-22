import { PrismaClient, Role, User } from "@prisma/client";

const db = new PrismaClient();

export { db, Role, User };
