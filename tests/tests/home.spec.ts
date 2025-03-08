import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173/";

test.describe("Home Page", () => {
    test("should load Home page successfully", async ({ page }) => {
        await page.goto(CLIENT_URL);
    });

    test("should display all categories", async ({ page }) => {
        await page.goto(CLIENT_URL);
        const categories = [
            "หูฟัง",
            "เมาส์",
            "คีย์บอร์ด",
            "ไมโครโฟน",
            "จอคอม",
            "ลำโพง",
        ];

        for (const category of categories) {
            await expect(page.getByText(category)).toBeVisible();
        }
    });

    test("should display carousel and recommended items", async ({ page }) => {
        await page.goto(CLIENT_URL);

        await expect(page.getByTestId("carousel-home")).toBeVisible();
        await expect(page.getByTestId("recommended-item")).toBeVisible();
    });
});
