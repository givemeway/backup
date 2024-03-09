import { PrismaClient, Prisma } from "../DB/prisma-client/index.js";
import { PrismaClient as PrismaUserClient } from "../DB/prisma-client/users/index.js";
// { log: ["query", "error", "warn", "info"] }
const prisma = new PrismaClient();
await prisma.$connect();

const prismaUser = new PrismaUserClient();
await prismaUser.$connect();

export { prisma, Prisma, prismaUser };
