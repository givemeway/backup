import dotenv from "dotenv";
dotenv.config();
import { PrismaClient as PrismaQdriveClient } from "../database/prisma-client/index.js";
import { PrismaClient as PrismaUserClient } from "../database/prisma-client/users/index.js";

export const userDBConnection = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const prismaQdrive = new PrismaQdriveClient();
      await prismaQdrive.$connect();
      resolve(prismaQdrive);
    } catch (err) {
      reject(err);
    }
  });
};

export const qdriveDBConnection = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const prismaUser = new PrismaUserClient();
      await prismaUser.$connect();
      resolve(prismaUser);
    } catch (err) {
      reject(err);
    }
  });
};
