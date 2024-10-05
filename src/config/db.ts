import mongoose from 'mongoose';
import { config } from './config';


async function connectDB() {
    try {
        
        mongoose.connection.on("connected", () => {
            console.log("DB Connected SUCCESSFULLY!!")
        });
        
        mongoose.connection.on("error", () => {
            console.log("ERROR in connecting to DB")
        });

        await mongoose.connect(config.databaseUrl as string);
        
    } catch (err) {
        console.error("DB Connection FAILED: ", err)
        process.exit(1);
    }
}

export { connectDB };   