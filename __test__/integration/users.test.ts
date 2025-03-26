import handler from "../../pages/api/user/user";
import connectDB from "../../lib/db/client";
import DB from "../../lib/db/db";
import User from "../../lib/db/models/user";
import { StatusCode } from "../../entities/http_status";
import { Logger } from "../../utils/logger";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { describe, test, expect, vi } from "vitest";

// Mock database connection
vi.mock("../../lib/db/client");


// Mock database connection
vi.mock("../../lib/db/client");
vi.mock("../../lib/db/db");
vi.mock("../../utils/logger");

describe("POST /api/user/user", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return 405 if method is not POST", async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: "GET",
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(StatusCode.METHOD_NOT_ALLOWED);
        expect(res._getJSONData()).toEqual({
            Ok: false,
            entity: "error",
            message: "Method not allowed",
        });
    });

    it("should return 400 if name or phoneNumber is missing", async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: "POST",
            body: { name: "John Doe" }, // Missing phoneNumber
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(StatusCode.BAD_REQUEST);
        expect(res._getJSONData()).toEqual({
            Ok: false,
            entity: "error",
            message: "Bad request",
        });
    });

    it("should return 500 if database connection fails", async () => {
        (connectDB as jest.Mock).mockRejectedValue(new Error("DB Connection Error"));

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: "POST",
            body: { name: "John Doe", phoneNumber: "1234567890" },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(StatusCode.INTERNAL_SERVER_ERROR);
        expect(res._getJSONData()).toEqual({
            Ok: false,
            entity: "error",
            message: "Internal server error",
        });

        expect(Logger.logError).toHaveBeenCalledWith(new Error("DB Connection Error"));
    });

    it("should return 500 if database write fails", async () => {
        (connectDB as jest.Mock).mockResolvedValue(undefined);
        (DB.create as jest.Mock).mockResolvedValue(null); // Simulate write failure

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: "POST",
            body: { name: "John Doe", phoneNumber: "1234567890" },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(StatusCode.INTERNAL_SERVER_ERROR);
        expect(res._getJSONData()).toEqual({
            Ok: false,
            entity: "error",
            message: "Internal server error",
        });
    });

    it("should return 200 if user is created successfully", async () => {
        (connectDB as jest.Mock).mockResolvedValue(undefined);
        const mockUser = { name: "John Doe", phoneNumber: "1234567890" };
        (DB.create as jest.Mock).mockResolvedValue(mockUser);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: "POST",
            body: mockUser,
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(StatusCode.OK);
        expect(res._getJSONData()).toEqual({
            Ok: true,
            entity: "User",
            message: "Success",
            data: mockUser,
        });
    });
});
