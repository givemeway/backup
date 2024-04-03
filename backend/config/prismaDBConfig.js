import { PrismaClient, Prisma } from "../DB/prisma-client/index.js";
import { PrismaClient as PrismaUserClient } from "../DB/prisma-client/users/index.js";

const prisma = new PrismaClient({ log: ["error", "warn", "info"] });
await prisma.$connect();

const prismaUser = new PrismaUserClient({
  log: ["error", "warn", "info"],
});
await prismaUser.$connect();
console.log("-------prisma instantiated -----------------");
export { prisma, Prisma, prismaUser };
