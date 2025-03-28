import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../lib/db/models/user";
import UserModelInterface from "../../../lib/db/interfaces/user";
import connectDB from '../../../lib/db/client';
import { Logger } from "../../../utils/logger";
import DB from "../../../lib/db/db";
import { APIResponse } from '../../../lib/server/api_response';
import { StatusCode } from "@/entities/http_status";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const failed: APIResponse<null> = {
        Ok: false,
        entity: "error",
        message: "",
    };
    if (req.method !== 'POST') {
        failed.message = 'Method not allowed';
        return res.status(StatusCode.METHOD_NOT_ALLOWED).json(failed);
    }

    const { name, phoneNumber } = req.body;

    if ((!name) || (!phoneNumber)) {
        failed.message = 'Bad request';
        return res.status(StatusCode.BAD_REQUEST).json(failed);
    }


    // try {
    //     await connectDB();
    // } catch (e: any) {
    //     failed.message = 'Internal server error';
    //     Logger.logError(e);
    //     return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(failed);
    // }


    try {
        const doc: UserModelInterface = { name: name, phoneNumber: phoneNumber };
        const result = await DB.create(doc, User);
        if (result === null) {
            failed.message = 'Internal server error';
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(failed);
        }
        const response: APIResponse<UserModelInterface> = {
            Ok: true,
            entity: "User",
            message: "Success",
            data: result,
        } as const;
        return res.status(StatusCode.OK).json(response);
    } catch (e: any) {
        failed.message = 'Internal server error';
        Logger.logError(e);
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json(failed);
    }
}
