import { Model, Document } from 'mongoose'
import DBInterface from './interfaces/db';
import { Logger } from '@/utils/logger';
import LocalCacheDB from "./cache";
import { ObjectId } from 'mongodb';
import safeExecute from '@/utils/errors/error_handler';
const finOne = async <T>(criteria: string | number, model: Model<T>): Promise<T | null> => {
    try {
        const result = await model.findOne({ criteria });
        if (result === null) {

            return null;
        }
        return result;
    } catch (e: any) {
        Logger.logError(e);
        return null;
    }
}

const create = async <T, K>(document: K | number, model: Model<T>): Promise<T | null> => {
    try {
        // { writeConcern: { w: 1 } }
        const result = await model.create(document);
        if (result) {
            return result;
        }

        return null;
    } catch (e: any) {
        Logger.logError(e);
        return null;
    }
}

const createAndCache = async <T, K>(document: K | number, model: Model<T>): Promise<T | null> => {
    try {
        // { writeConcern: { w: 1 } }
        const result = await model.create(document);
        if (result) {
            const id = new ObjectId(result._id as ObjectId).toString();
            const [res, err] = await safeExecute(LocalCacheDB.set, id, JSON.stringify(result), 60);
            if (err !== null) {
                console.log(`Error creating cache for ${id}: ${err}`);
            }
            // const res = await LocalCacheDB.set(id, JSON.stringify(result), 60);
            if (res) {
                console.log(`Cache created for ${id}`);
            }
            const cached = await LocalCacheDB.get(id);
            if (cached) {
                const parsed = JSON.parse(cached);
                console.log(`Cache retrieved for ${id}: ${JSON.stringify(parsed)}`);
            } else {
                console.log(`Cache not found for ${id}`);
            }
        }

        return result;
    } catch (e: any) {
        Logger.logError(e);
        return null;
    }
}


const DB: DBInterface = {
    findOne: finOne,
    create: create,
} as const;

export default DB;
