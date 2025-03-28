// lib/redisClient.ts
import { createClient, RedisClientType } from 'redis'; 1
import { Logger } from '../../utils/logger'; // Assuming you have a logger

// Use environment variables for configuration! Avoid hardcoding.
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create the client instance
const redisClient: RedisClientType = createClient({
    url: redisUrl,
    // You can add other options here if needed, like:
    // socket: {
    //   connectTimeout: 5000, // milliseconds
    //   reconnectStrategy: retries => Math.min(retries * 50, 500) // Example reconnect strategy
    // }
});

redisClient.on('error', (err: any) => {
    Logger.logError(err);
    // Depending on your app's needs, you might want to exit,
    // implement more robust retry logic, or switch to a degraded mode.
});

redisClient.on('connect', () => {
    Logger.log('Connecting to Redis...');
});

redisClient.on('ready', () => {
    Logger.log('✅ Redis client connected successfully and ready to use.');
});

redisClient.on('end', () => {
    Logger.log('Redis client connection ended.');
});

// Function to connect (call this once at startup)
let isConnected = false;
async function connectRedis(): Promise<void> {
    if (!isConnected && !redisClient.isReady) {
        try {
            await redisClient.connect();
            isConnected = true;
        } catch (err: any) {
            Logger.logError(err);
            // Rethrow or handle as appropriate for your app's startup process
            throw err;
        }
    }
}

// Function to disconnect (call this during graceful shutdown)
async function disconnectRedis(): Promise<void> {
    if (isConnected || redisClient.isReady) {
        try {
            await redisClient.quit(); // Waits for pending replies, then closes
            // or await redisClient.disconnect(); // Closes immediately
            isConnected = false;
        } catch (err: any) {
            Logger.logError(err);
        }
    }
}

// Export the client instance and connection functions
export { redisClient, connectRedis, disconnectRedis };
