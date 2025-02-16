import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

// all env variables
const _config = {
    port: process.env.PORT,
    databaseUrl : process.env.MONGODB_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    jwtExpiry: process.env.JWT_EXPIRY,
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,

    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryUrl: process.env.CLOUDINARY_URL
}

export const config = Object.freeze(_config);