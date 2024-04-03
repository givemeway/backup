import dotenv from "dotenv";
dotenv.config();

export const domain = "localhost";
export const host_url = `http://${domain}`;
export const origin = `${host_url}:3000`;
export const serverDomain = `http://localhost:3001`;
export const frontEndDomain = `http://localhost:3000`;
export const thumbnailMicroservice = "http://localhost:3003/api/v1/preview";

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
