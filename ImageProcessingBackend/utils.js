import { Kafka, logLevel } from "kafkajs";
import { createDecipheriv, scrypt } from "node:crypto";
import dotenv from "dotenv";
import sharp from "sharp";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PrismaClient as PrismaQdrive } from "./database/prisma-client/index.js";
import { PrismaClient as PrismaUser } from "./database/prisma-client/users/index.js";

import { PassThrough } from "stream";

let s3Client;
dotenv.config();

const prismaQdrive = new PrismaQdrive();
const prismaUser = new PrismaUser();
await prismaQdrive.$connect();
await prismaUser.$connect();

const sourceBucket = process.env.BUCKET;
const dstBucket = process.env.BUCKET_PROCESSED_IMAGES;

try {
  s3Client = new S3Client({
    region: process.env.REGION_E2,
    endpoint: process.env.ENDPOINT_E2,
    credentials: {
      accessKeyId: process.env.ACCESSKEY_E2,
      secretAccessKey: process.env.SECRETKEY_E2,
    },
  });
} catch (err) {
  console.log(err);
}

function hexToBuffer(hexString) {
  let byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

const decryptFile = (input, salt, iv, password) => {
  return new Promise(async (resolve, reject) => {
    const saltBuffer = hexToBuffer(salt);
    const ivBuffer = hexToBuffer(iv);
    const algorithm = "aes-256-cbc";
    try {
      const key = await new Promise((resolve, reject) => {
        scrypt(password, saltBuffer, 32, (err, key) => {
          if (err) reject(err);
          else {
            resolve(key);
          }
        });
      });
      const dicpher = createDecipheriv(algorithm, key, ivBuffer);
      resolve(input.pipe(dicpher));
    } catch (err) {
      reject(err);
    }
  });
};

const kafka = new Kafka({
  clientId: "image-transform-server",
  brokers: ["poetic-tick-9403-eu1-kafka.upstash.io:9092"],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256",
    username: "cG9ldGljLXRpY2stOTQwMyQsPn_6NquhIskDTFU5gAGPyeFlm8XbBgqy98BTVJY",
    password: "MzkwMDNkMjUtNzc0MC00OTNlLWI2YzMtOWI4NjAxNWQwMzMx",
  },
  logLevel: logLevel.ERROR,
});
const consumer = kafka.consumer({
  groupId: "IMAGE-TRANSFORM-SERVER-GROUP",
});

const getObject = async (value, Bucket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { username, id, avatar } = value;
      if (!avatar) {
        const Key = `${username}/${id}`;
        const getCommand = new GetObjectCommand({ Bucket, Key });
        const file = await prismaQdrive.file.findFirst({
          where: { uuid: id, username },
          select: {
            salt: true,
            iv: true,
            size: true,
            height: true,
            width: true,
          },
        });

        const user = await prismaUser.user.findUnique({
          where: { username },
          select: { enc: true },
        });
        if (file !== null) {
          const { salt, iv } = file;
          const { enc } = user;
          const input = (await s3Client.send(getCommand)).Body;
          resolve({
            input: await decryptFile(input, salt, iv, enc),
            height: file.height,
            width: file.width,
          });
        } else {
          reject("FILENOTFOUND");
        }
      } else {
        const Key = `avatar/${username}/${id}`;
        const getCommand = new GetObjectCommand({ Bucket, Key });
        resolve({ input: (await s3Client.send(getCommand)).Body });
      }
    } catch (err) {
      reject(err);
    }
  });
};

const putObject = (Key, Bucket, Body) => {
  return new Promise(async (resolve, reject) => {
    // console.log(Key);

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body,
      },
    });

    upload.on("error", (err) => {
      console.error(err);
      reject(err);
    });

    upload.on("httpUploadProgress", (details) => console.log(details));

    upload
      .done()
      .then((res) => {
        resolve(res.Key);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

const process_and_upload_images = (message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const value = JSON.parse(message.value);
      // console.log(value);
      const pipeline = sharp();

      const { input, height, width } = await getObject(value, sourceBucket);
      const output1 = new PassThrough();
      const output2 = new PassThrough();
      const output3 = new PassThrough();
      const output4 = new PassThrough();
      const output5 = new PassThrough();
      const output6 = new PassThrough();
      let resizeHeight;
      let resizeWidth;
      resizeHeight = height > width ? 32 : null;
      resizeWidth = width > height ? 32 : null;
      pipeline
        .clone()
        .rotate()
        .resize(resizeWidth, resizeHeight, {
          fit: "contain",
          background: "white",
        })
        .pipe(output1);
      resizeHeight = height > width ? 640 : null;
      resizeWidth = width > height ? 640 : null;
      pipeline
        .clone()
        .rotate()
        .resize(resizeWidth, resizeHeight, {
          fit: "contain",
          background: "white",
        })
        .pipe(output2);
      resizeHeight = height > width ? 900 : null;
      resizeWidth = width > height ? 900 : null;
      pipeline
        .clone()
        .rotate()
        .resize(resizeWidth, resizeHeight, {
          fit: "contain",
          background: "white",
        })
        .pipe(output3);
      resizeHeight = height > width ? 256 : null;
      resizeWidth = width > height ? 256 : null;
      pipeline
        .clone()
        .rotate()
        .resize(resizeWidth, resizeHeight, {
          fit: "contain",
          background: "white",
        })
        .pipe(output4);
      resizeHeight = height > width ? 1280 : null;
      resizeWidth = width > height ? 1280 : null;
      pipeline
        .clone()
        .rotate()
        .resize(resizeWidth, resizeHeight, {
          fit: "contain",
          background: "white",
        })
        .pipe(output5);
      resizeHeight = height > width ? 2048 : null;
      resizeWidth = width > height ? 2048 : null;
      pipeline
        .clone()
        .rotate()
        .resize(resizeWidth, resizeHeight, {
          fit: "contain",
          background: "white",
        })
        .pipe(output6);

      input.pipe(pipeline);
      const Key = `${value?.avatar ? "avatar/" : ""}${value.username}/${
        value.id
      }`;
      const key_32w = `${Key}_32w`;
      const key_640w = `${Key}_640w`;
      const key_900w = `${Key}_900w`;
      const key_256w = `${Key}_256w`;
      const key_1280w = `${Key}_1280w`;
      const key_2048w = `${Key}_2048w`;

      const promises = [];
      const bucket = value?.avatar ? sourceBucket : dstBucket;
      if (value?.avatar) {
        promises.push(putObject(key_32w, bucket, output1));
        promises.push(putObject(key_640w, bucket, output2));
      } else {
        promises.push(putObject(key_32w, bucket, output1));
        promises.push(putObject(key_640w, bucket, output2));
        promises.push(putObject(key_900w, bucket, output3));
        promises.push(putObject(key_256w, bucket, output4));
        promises.push(putObject(key_1280w, bucket, output5));
        promises.push(putObject(key_2048w, bucket, output6));
      }

      await Promise.all(promises);
      resolve();
    } catch (err) {
      console.log(err);
      if (err === "FILENOTFOUND") {
        resolve();
      } else {
        reject(err);
      }
    }
  });
};

export const initiKafkaConsunmer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "PROCESS-IMAGE", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await process_and_upload_images(message);
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: JSON.parse(message.value),
      });
    },
  });
};

export { s3Client };
