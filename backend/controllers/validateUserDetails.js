import jwt from "jsonwebtoken";
import cookie from "cookie";
import { cookieOpts } from "../config/config.js";
import { JWT_SECRET } from "../config/config.js";
import { createHash } from "node:crypto";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";

const validateUserDetails = async (req, res) => {
  let encodedString = req.headers.authorization;
  let extractedUsernamePassword;
  let username;
  let password;
  const usernametype = req.body.usernametype;
  console.log("usernametype -->", usernametype);
  try {
    if (typeof encodedString === "string" && typeof usernametype === "string") {
      extractedUsernamePassword = atob(encodedString.split(" ")[1]);
      username = extractedUsernamePassword.split(":")[0];
      password = extractedUsernamePassword.split(":")[1];
      const hashPass = createHash("sha512").update(password).digest("hex");
      const returnedUser = await prisma.user.findUnique({
        where: {
          username,
          password: hashPass,
        },
        select: {
          username: true,
          first_name: true,
          last_name: true,
          id: true,
          email: true,
        },
      });

      if (returnedUser !== null) {
        const { username, first_name, last_name, id, email } = returnedUser;
        const payload = {
          Username: username,
          first: first_name,
          last: last_name,
          userID: id,
          email,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, cookieOpts)
        );

        res.status(200).json({ success: true, msg: "login success" });
      } else {
        console.log("incorrect");
        res
          .status(401)
          .json({ success: false, msg: "UserName / Password Incorrect" });
      }
    } else {
      console.log("invalid input");

      res.status(422).json({ success: false, msg: "Invalid Input" });
    }
  } catch (err) {
    console.error(err);
    console.log("user not found");
    res.status(404).json({ success: false, msg: "User not found" });
  }
};

export { validateUserDetails };
