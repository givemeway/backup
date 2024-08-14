import { createHash, randomFill } from "node:crypto";
import { Buffer } from "node:buffer";
import { prismaUser } from "../config/prismaDBConfig.js";
import { Avatar } from "../models/mongodb.js";

const generateEncKey = () => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.alloc(32);
    randomFill(buffer, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString("hex"));
    });
  });
};

export const signup = async (req, res, next) => {
  try {
    const { username, firstname, lastname, email, password, phone } = req.body;
    req.username = username;
    const enc = await generateEncKey();
    const hashPass = createHash("sha512").update(password).digest("hex");

    const user = await prismaUser.user.create({
      data: {
        username,
        email,
        password: hashPass,
        first_name: firstname,
        last_name: lastname,
        phone,
        enc,
      },
    });
    await Avatar.create({
      username,
      firstName: firstname,
      lastName: lastname,
      initial: `${firstname.split("")[0].toUpperCase()}${lastname
        .split("")[0]
        .toUpperCase()}`,
    });
    res.status(200).json({
      success: true,
      msg: `Username ${username} created!`,
    });
  } catch (err) {
    if (err?.code === "P2002") {
      return res
        .status(409)
        .json({ success: false, msg: `Username ${req.username} exists!` });
    }
    return res.status(500).json(err);
  }
};
