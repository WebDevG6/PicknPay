import { test, expect } from "@playwright/test";

test("add Product to Cart", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("textbox", { name: "อีเมล" }).click();
    await page.getByRole("textbox", { name: "อีเมล" }).fill("cus01@gmail.com");
    await page.getByRole("textbox", { name: "รหัสผ่าน" }).click();
    await page.getByRole("textbox", { name: "รหัสผ่าน" }).fill("cus0101");
    await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("button", { name: "สินค้าทั้งหมด" }).click();
    await page.waitForSelector(".border.border-black.shadow-sm");// รอให้ Card ปรากฏใน DOM
    const productCard = page.locator(".border.border-black.shadow-sm");
    await productCard.first().click();
    await expect(page).toHaveURL(/\/products\/\d+/);
    await page.getByRole("button", { name: "เพิ่มไปยังรถเข็น" }).click();
    const userCart = page.locator(".relative.inline-flex.justify-center"); //cart icon
    await userCart.click();
    await expect(page).toHaveURL(/\/cart/);
    const cartItemSelected = page.locator(".transition.group"); //เช็คว่าถูกเลือกมั้ย
    await expect(cartItemSelected).toBeVisible();
    const cartItemName = page.locator(".flex.flex-col.justify-between"); //เช็คว่าชื่อถูกมั้ย
    await expect(cartItemName).toHaveText("Logitech Wave Keys Wireless Keyboard (EN/TH) Graphite฿1,990รายละเอียดเพิ่มเติม");
});