import User from "../../../lib/db/models/user";

describe("User Model", () => {
    it("should create a user successfully", async () => {
        const user = await User.create({ name: "Alice", phoneNumber: "alice@example.com" });
        expect(user.name).toBe("Alice");
        expect(user.phoneNumber).toBe("alice@example.com");
    });

    it("should not allow duplicate phoneNumbers", async () => {
        await User.create({ name: "Bob", phoneNumber: "bob@example.com" });

        await expect(
            User.create({ name: "Bob2", phoneNumber: "bob@example.com" })
        ).rejects.toThrowError(/E11000 duplicate key error/);
    });
});
