export const ORIGIN = "http://localhost:3000";
export const corsOpts = {
  origin: ORIGIN,
  allowedHeaders:
    "Content-Type,X-CSRF-Token,Authorization,Origin,filename,dir,devicename,Content-Disposition,filestat,currentdirectory,backuptype",
  exposedHeaders: "Set-Cookie",
  methods: "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  credentials: true,
};
