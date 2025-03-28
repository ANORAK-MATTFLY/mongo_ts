import { Model, Document } from 'mongoose'
import DBInterface from './interfaces/db';
import { Logger } from '@/utils/logger';

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
