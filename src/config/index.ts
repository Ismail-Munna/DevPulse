import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connectionString: process.env.CONNECTIONSTRING as string,
  port: Number(process.env.PORT) || 5000,
  secret: process.env.jwt_secret as string,
};

export default config;