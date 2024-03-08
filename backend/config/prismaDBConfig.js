import { PrismaClient, Prisma } from "../DB/prisma-client/index.js";
import { PrismaClient as PrismaUserClient } from "../DB/prisma-client/users/index.js";

const prisma = new PrismaClient({ log: ["query", "error", "warn", "info"] });
await prisma.$connect();

const prismaUser = new PrismaUserClient();
await prismaUser.$connect();

export { prisma, Prisma, prismaUser };
