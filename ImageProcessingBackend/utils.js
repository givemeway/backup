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
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESSKEY,
      secretAccessKey: process.env.SECRETKEY,
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

const getObject = async (id, username, Bucket) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Key = `${username}/${id}`;
      const getCommand = new GetObjectCommand({ Bucket, Key });
      const file = await prismaQdrive.file.findFirst({
        where: { uuid: id, username },
        select: { salt: true, iv: true, size: true },
      });

      const user = await prismaUser.user.findUnique({
        where: { username },
        select: { enc: true },
      });
      const { salt, iv } = file;
      const { enc } = user;
      const input = (await s3Client.send(getCommand)).Body;
      resolve(await decryptFile(input, salt, iv, enc));
    } catch (err) {
      reject(err);
    }
  });
};

const putObject = (Key, Bucket, Body) => {
  return new Promise(async (resolve, reject) => {
    console.log(Key);
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

const process_and_upload_images = async (message) => {
  const value = JSON.parse(message.value);
  console.log(value);
  const pipeline = sharp();

  const input = await getObject(value.id, value.username, sourceBucket);
  const output1 = new PassThrough();
  const output2 = new PassThrough();
  const output3 = new PassThrough();
  const output4 = new PassThrough();

  pipeline.clone().resize(32, 32, { fit: "cover" }).pipe(output1);
  pipeline.clone().resize(64, 64, { fit: "cover" }).pipe(output2);
  pipeline.clone().resize(128, 128, { fit: "cover" }).pipe(output3);
  pipeline.clone().resize(256, 256, { fit: "cover" }).pipe(output4);

  input.pipe(pipeline);
  const Key = `${value.username}/${value.id}`;
  const key_32w = `${Key}_32w`;
  const key_64w = `${Key}_64w`;
  const key_128w = `${Key}_128w`;
  const key_256w = `${Key}_256w`;
  try {
    const promises = [];
    promises.push(putObject(key_32w, dstBucket, output1));
    promises.push(putObject(key_64w, dstBucket, output2));
    promises.push(putObject(key_128w, dstBucket, output3));
    promises.push(putObject(key_256w, dstBucket, output4));

    await Promise.all(promises);
  } catch (err) {
    console.log(err);
  }
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
