import { Schema, model } from "mongoose";

const imageSchema = new Schema({
  username: String,
  mimetype: String,
  uuid: String,
  originalName: String,
  width: Number,
  height: Number,
});

export const Image = model("Images", imageSchema, "images");
