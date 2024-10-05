import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

// all env variables
const _config = {
    port: process.env.PORT,
    databaseUrl : process.env.MONGODB_CONNECTION_STRING,
}

export const config = Object.freeze(_config);