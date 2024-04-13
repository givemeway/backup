import dotenv from "dotenv";
dotenv.config();

// export const domain = "localhost";
// export const host_url = `http://${domain}`;
// export const origin = `${host_url}:3000`;
// export const serverDomain = `http://localhost:3001`;
// export const frontEndDomain = `http://localhost:3000`;
// export const thumbnailMicroservice = "http://localhost:3003/api/v1/preview";
export const domain = "qdrive.netlify.app";
export const host_url = `http://${domain}`;
export const origin = "https://qdrive.netlify.app";
export const serverDomain = "https://backup-8toq.onrender.com";
export const frontEndDomain = "https://qdrive.netlify.app";
export const thumbnailMicroservice = "http://localhost:3003/api/v1/preview";

export const corsOpts = {
  origin: origin,
  allowedHeaders: "Content-Type,X-CSRF-Token,Authorization,Origin",
  exposedHeaders: "Set-Cookie",
  methods: "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  credentials: true,
};

export const cookieOpts = {
  secure: true,
  httpOnly: true,
  sameSite: "none",
  path: "/",
  domain: domain,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

export const csrfCookieOpts = {
  secure: false,
  httpOnly: false,
  // sameSite: "none",
  path: "/",
  domain: domain,
  // expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

export const {
  PORT,
  API_BASE_URL,
  ORIGIN,
  FRONT_END_DOMAIN,
  SERVER_DOMAIN,
  DATABASE_URL,
  DOMAIN,
  JWT_SECRET,
} = process.env;
