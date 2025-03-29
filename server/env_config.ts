// server/config.ts
import { Logger } from './utils/logger/logger';

// Bun automatically loads .env in development, but explicit loading is safer for production builds
// If needed: import 'dotenv/config';

function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        Logger.logError(`Missing required environment variable: ${key}`);
        // Depending on severity, you might want to throw or exit
        // throw new Error(`Missing required environment variable: ${key}`);
        process.exit(1); // Exit if critical config is missing
    }
    return value;
}

export const config = {
    trello: {
        apiKey: getEnvVar('TRELLO_API_KEY'),
        apiToken: getEnvVar('TRELLO_API_TOKEN'),
    },
    github: {
        token: getEnvVar('GITHUB_TOKEN'),
        username: getEnvVar('GITHUB_USERNAME'),
        baseBranch: process.env.GITHUB_BASE_BRANCH || 'main',
    },
    ai: {
        // Add logic here to check which key is present if supporting both
        openaiApiKey: process.env.OPENAI_API_KEY,
        groqApiKey: process.env.GROQ_API_KEY,
        // You might want a check here to ensure at least one AI key is set
    },
    // Add any other config like temporary directory path if needed
    tempDir: './server/temp', // Make sure this exists and is writable / .gitignored
};

// Validate that at least one AI key is present
if (!config.ai.openaiApiKey && !config.ai.groqApiKey) {
    Logger.logError('Missing AI configuration: Set either OPENAI_API_KEY or GROQ_API_KEY in .env');
    process.exit(1);
}

Logger.logInfo("Configuration loaded successfully.");
