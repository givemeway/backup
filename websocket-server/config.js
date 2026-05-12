export const ORIGIN = "https://websocket-server-v220.onrender.com";
export const corsOpts = {
  origin: ORIGIN,
  allowedHeaders:
    "Content-Type,X-CSRF-Token,Authorization,Origin,filename,dir,devicename,Content-Disposition,filestat,currentdirectory,backuptype",
  exposedHeaders: "Set-Cookie",
  methods: "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  credentials: true,
};
