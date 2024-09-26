import { randomFill, createHash } from "crypto";

export const createBackupCodes = async (req, res, next) => {
  res.status(200).json({ success: true, msg: "received" });
};
