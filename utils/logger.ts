import LoggerInterface from "./interfaces/logger";

const logError = (error: any): void => {
    if (process.env.NODE_ENV === "development") {
        console.error(error);
    }
};


export const log = (error: any): void => {
    if (process.env.NODE_ENV === "development") {
        console.log(error);
    }
};


export const Logger: LoggerInterface = {
    logError: logError,
    log: log,
} as const;
