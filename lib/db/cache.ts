import { redisClient } from './cache_client';
import CacheInterface from './interfaces/cache';





const get = async (cachedKey: string): Promise<string | null> => {
    const cachedResult = await redisClient.get(cachedKey);
    return cachedResult;
}



const set = async (cacheKey: string, expiresIn: number): Promise<string | null> => {
    const result = await redisClient.set(cacheKey, JSON.stringify(cacheKey), {
        EX: expiresIn // EX = seconds
        // NX: true // Optional: Set only if key does not exist
        // XX: true // Optional: Set only if key exists
    });
    return result;
}


const del = async (cacheKey: string): Promise<number> => {
    const result = await redisClient.del(cacheKey);
    return result;
}
const exists = async (cacheKey: string): Promise<number> => {
    const result = await redisClient.exists(cacheKey);
    return result;
}
const flushAll = async (): Promise<string | null> => {
    const result = await redisClient.flushAll();
    return result;
}
const ping = async (): Promise<string | null> => {
    const result = await redisClient.ping();
    return result;
}
const getKeys = async (pattern: string): Promise<string[]> => {
    const keys = await redisClient.keys(pattern);
    return keys;
}
const getAll = async (pattern: string): Promise<(string | null)[]> => {
    const keys = await redisClient.keys(pattern);
    const values = await Promise.all(keys.map(key => redisClient.get(key)));
    return values;
}
const getAllKeys = async (): Promise<string[]> => {
    const keys = await redisClient.keys('*');
    return keys;
}
const getAllValues = async (): Promise<(string | null)[]> => {
    const keys = await redisClient.keys('*');
    const values = await Promise.all(keys.map(key => redisClient.get(key)));
    return values;
}



const Cache: CacheInterface = {
    get,
    set,
    del,
    exists,
    flushAll,
    ping,
    getKeys,
    getAll,
    getAllKeys,
    getAllValues,
} as const;

export default Cache;
