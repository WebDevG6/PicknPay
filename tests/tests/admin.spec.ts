import { test, expect } from "@playwright/test";
import path from "path";
const filePath = path.resolve(__dirname, "../images/MaonoAU902.jpg");

test("addProduct", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("textbox", { name: "Email" }).click();
    await page
        .getByRole("textbox", { name: "Email" })
        .fill("admin01@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).click();
    await page.getByRole("textbox", { name: "Password" }).fill("admin0101");
    await page.getByRole("button", { name: "Login" }).click();
    await page.getByRole("menu").getByText("Products").click();
    await page.getByText("Add Products").click();
    await page.getByRole("textbox", { name: "ระบุชื่อสินค้า" }).click();
    await page
        .getByRole("textbox", { name: "ระบุชื่อสินค้า" })
        .fill("ProductTest1");
    await page
        .getByRole("spinbutton", { name: "กรอกราคาสินค้า (บาท)" })
        .click();
    await page
        .getByRole("spinbutton", { name: "กรอกราคาสินค้า (บาท)" })
        .fill("1000");
    await page.locator("#rc_select_3").click();
    await page.getByTitle("logitech").click();
    await page
        .getByRole("spinbutton", { name: "กรอกจำนวนสินค้าคงเหลือ" })
        .click();
    await page
        .getByRole("spinbutton", { name: "กรอกจำนวนสินค้าคงเหลือ" })
        .fill("30");
    await page
        .getByRole("textbox", { name: "ใส่รายละเอียดสินค้าให้ครบถ้วน" })
        .click();
    await page
        .getByRole("textbox", { name: "ใส่รายละเอียดสินค้าให้ครบถ้วน" })
        .fill("ProductTester1");
    await page.getByRole("button", { name: "keyboard" }).click();
    await page.locator("span").filter({ hasText: "Upload" }).nth(1).click();
    const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser"),
        page.locator(".ant-upload").nth(0).click(),
    ]);
    await fileChooser.setFiles(filePath);
    await page.waitForTimeout(3000);
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "เพิ่มสินค้า" }).click();
    await page.waitForTimeout(2000);
    await page.getByText("Manage Products").click();
    await page.getByRole("cell", { name: "ProductTest1" }).first().click();
    await page.waitForTimeout(3000);
    await page
        .locator(
            "tr:nth-child(9) > td > .flex > .ant-image > .ant-image-mask > .ant-image-mask-info"
        )
        .click();
    await page.locator(".ant-image-preview-wrap").click();
    await page.getByRole("dialog").locator("div").first().press("Escape");
    await page
        .locator(
            "tr:nth-child(9) > td:nth-child(7) > .flex > button:nth-child(2)"
        )
        .click();
    await page.getByRole("button", { name: "ยืนยันลบ" }).click();
    await page.waitForTimeout(3000);
});
