import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5174,
		strictPort: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@features": path.resolve(__dirname, "./src/features"),
			"@shared": path.resolve(__dirname, "./src/shared"),
			"@store": path.resolve(__dirname, "./src/store"),
		},
	},
});