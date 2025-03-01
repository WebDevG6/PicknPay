import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@src": resolve(__dirname, "src"),
            "@components": resolve(__dirname, "src/components"),
            "@hooks": resolve(__dirname, "src/hooks"),
            "@context": resolve(__dirname, "src/context"),
            "@conf": resolve(__dirname, "src/conf"),
            "@pages": resolve(__dirname, "src/pages"),
            "@layouts": resolve(__dirname, "src/layouts"),
        },
    },
});
