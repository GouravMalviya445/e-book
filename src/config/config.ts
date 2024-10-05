import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

// all env variables
const _config = {
    port: process.env.PORT,
    databaseUrl : process.env.MONGODB_CONNECTION_STRING,
    env: process.env.NODE_ENV
}

export const config = Object.freeze(_config);