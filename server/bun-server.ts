import { serve } from "bun";
import { readdirSync } from "fs";
import { join } from "path";
import connectDB from "../lib/db/client";
import { connectRedis, disconnectRedis, redisClient } from '../lib/db/cache_client'; // Adjust path
import mongoose from "mongoose";
import { Logger } from "@/utils/logger";



// --- Connect to Redis on Startup ---
try {
    await connectRedis();
    // Optional: Test connection
    const pong = await redisClient.ping();
    Logger.log(`Redis ping response: ${pong}`); // Should log PONG

    // You might want to run other startup tasks AFTER Redis connects
    // e.g., initializing caches

} catch (error: any) {
    Logger.logError(`🚨 Failed to connect to Redis during startup. Exiting: ${error}`);
    process.exit(1); // Exit if Redis connection is critical
}



const routes: Record<string, (req: Request) => Response | Promise<Response>> = {};

// Dynamically import all routes
// const routesDir = "./routes";
const routesDir = join(__dirname, "v1/routes");  // Ensure correct absolute path
const paths = readdirSync(routesDir);
for (const file of paths) {
    if (file.endsWith(".ts")) {
        const routeModule = await import(join(routesDir, file));
        const routeName = "/" + file.replace(".ts", ""); // Example: "users.ts" -> "/users"
        routes[routeName] = routeModule.default;
    }
}

// Start the Bun server
serve({
    port: 4009,
    async fetch(req: Request) {
        try {
            await connectDB();
            // await mongoose
            // .connect("mongodb://localhost:27017/mongoTs", {
            // mongodb://mongodb:27017/mongoTs
            // dbName: "mongoTs", // Optional: specify DB name
            // bufferCommands: false,
            // })

        } catch (e: any) {
            console.log(e);
            console.log("Error connecting to database");
        }

        // console.log(req);
        const url = new URL(req.url);
        const handler = routes[url.pathname];
        // console.log(url.pathname);
        // console.log(routes);
        // console.log(handler);

        if (handler) {
            return handler(req);
        }

        return new Response(JSON.stringify({ error: "Route not found" }), { status: 404 });
    }
});

console.log("🚀 Bun server running at http://localhost:4009");
