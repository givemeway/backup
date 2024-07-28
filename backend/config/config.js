import dotenv from "dotenv";
dotenv.config();

// export const DOMAIN = "localhost";
// export const ORIGIN = "http://localhost:3000";
// export const SERVER_DOMAIN = `http://localhost:3001`;
// export const FRONTEND_DOMAIN = `http://localhost:3000`;
export const DOMAIN = "qdrive.space";
export const HOST_URL = "https://qdrive.space";
export const ORIGIN = "https://qdrive.space";
export const SERVER_DOMAIN = "https://api.qdrive.space";
export const FRONTEND_DOMAIN = "https://qdrive.space";

export const corsOpts = {
  origin: ORIGIN,
  allowedHeaders:
    "Content-Type,X-CSRF-Token,Authorization,Origin,filename,dir,devicename,Content-Disposition,filestat,currentdirectory,backuptype",
  exposedHeaders: "Set-Cookie",
  methods: "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  credentials: true,
};

export const cookieOpts = {
  secure: true,
  httpOnly: true,
  sameSite: "none",
  path: "/",
  domain: DOMAIN,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

export const { JWT_SECRET, THUMBNAIL_MS } = process.env;
console.log(JWT_SECRET, THUMBNAIL_MS);
