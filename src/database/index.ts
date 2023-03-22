import { PrismaClient, Role, Status, User } from "@prisma/client";

const db = new PrismaClient();

export { db, Role, Status, User };
