import mongoose from "mongoose";
const { Schema, model } = mongoose;

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const fileSchema = new Schema({
  uuid: String,
});

const folderSchema = new Schema({
  uuid: String,
});
const transferSchema = new Schema({
  owner: String,
  sharedBy: String,
  sharedWith: { type: Map },
  password: { type: String, default: "" },
  files: { type: Map },
  folders: { type: Map },
  created_at: { type: Date, default: Date.now },
  expires_at: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
});

const shareSchema = new Schema({
  owner: String,
  sharedBy: String,
  sharedWith: { type: Map },
  password: { type: String, default: "" },
  item: String,
  uuid: String,
  created_at: { type: Date, default: Date.now },
  expires_at: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
});

const fileShareSchema = new Schema({
  owner: String,
  sharedBy: String,
  sharedWith: { type: Map },
  password: { type: String, default: "" },
  item: String,
  uuid: String,
  created_at: { type: Date, default: Date.now },
  expires_at: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
});

const folderShareSchema = new Schema({
  owner: String,
  sharedBy: String,
  sharedWith: { type: Map },
  password: { type: String, default: "" },
  item: String,
  uuid: String,
  created_at: { type: Date, default: Date.now },
  expires_at: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
});

const fileDownloadSchema = new Schema({
  uuid: String,
  file: String,
  path: String,
});

const folderDownloadSchema = new Schema({
  uuid: String,
  folder: String,
  path: String,
});

const downloadZipSchema = new Schema({
  owner: String,
  files: [fileDownloadSchema],
  folders: [folderDownloadSchema],
  created_at: { type: Date, default: Date.now },
  expires_at: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
});

const imageSchema = new Schema({
  username: String,
  mimetype: String,
  uuid_original: String,
  uuid_thumb_32x32: String,
  uuid_thumb_64x64: String,
  uuid_thumb_128x128: String,
  uuid_thumb_256x256: String,
  uuid_preview_480w: String,
  uuid_preview_640w: String,
  uuid_preview_900w: String,
  uuid_preview_1024w: String,
  uuid_preview_1280w: String,
  uuid_preview_1600w: String,
  uuid_preview_2048w: String,
});

const Transfer = model("Transfers", transferSchema, "transfers");
const Share = model("Shares", shareSchema, "shares");
const FileShare = model("FileShares", fileShareSchema, "fileshares");
const FolderShare = model("FolderShares", folderShareSchema, "folderShares");
const DownloadZip = model("Downloads", downloadZipSchema, "downloads");
const Image = model("Images", imageSchema, "images");

export { Share, Transfer, DownloadZip, Image, FileShare, FolderShare };
