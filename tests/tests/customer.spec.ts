import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

function generateRandomEmail() {
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `register.customer.testing.${randomPart}@gmail.com`;
}

test("register", async ({ page }) => {
    const TEST_USER = {
        firstName: "Customer",
        lastName: "ForTesting99",
        email: generateRandomEmail(),
        password: "cus99cus99",
        address: "testing address",
    };

    //register
    await page.goto(`${CLIENT_URL}/register`);
    await page.getByRole("textbox", { name: "First Name" }).fill(TEST_USER.firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(TEST_USER.lastName);
    await page.getByRole("textbox", { name: "Email" }).fill(TEST_USER.email);
    await page.getByRole("textbox", { name: "Password" }).fill(TEST_USER.password);
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("textbox", { name: "Address" }).fill(TEST_USER.address);
    await page.getByRole("button", { name: "Register" }).click();

    //check profile
    await page.getByRole("button", { name: "profile" }).click();
    await page.getByRole("menuitem", { name: "โปรไฟล์" }).click();
    await expect(page.locator("#firstname")).toHaveValue(TEST_USER.firstName);
    await expect(page.locator("#lastname")).toHaveValue(TEST_USER.lastName);
    await expect(page.locator("#email")).toHaveValue(TEST_USER.email);
    await expect(page.locator("#address")).toHaveValue(TEST_USER.address);
});
