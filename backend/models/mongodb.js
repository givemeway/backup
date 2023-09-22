import mongoose from "mongoose";
const { Schema, model } = mongoose;

const fileSchema = new Schema({
  file: String,
  uuid: String,
});

const folderSchema = new Schema({
  folder: String,
  path: String,
  uuid: String,
});
const shareSchema = new Schema({
  username: String,
  files: [fileSchema],
  folders: [folderSchema],
});

const Share = model("Shares", shareSchema, "shares");

export default Share;
