import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
    const base = "/";

    return {
        base,
        plugins: [react(), tailwindcss()],
        server: {
            allowedHosts: ['atlas.bizan.pro'],
            proxy: {
                // Прокси для локальной разработки - проксируем запросы к /api на бэкенд
                "/api": {
                    target: "http://127.0.0.1:8000",
                    changeOrigin: true,
                    secure: false,
                    cookieDomainRewrite: "",
                    configure: (proxy, _options) => {
                        proxy.on("error", (err, _req, _res) => {
                            console.log("proxy error", err);
                        });
                        proxy.on("proxyReq", (proxyReq, req, _res) => {
                            if (req.headers.origin) {
                                proxyReq.setHeader("X-Original-Origin", req.headers.origin);
                                proxyReq.setHeader("Origin", req.headers.origin);
                            }
                            // Сохраняем Referer
                            if (req.headers.referer) {
                                proxyReq.setHeader("Referer", req.headers.referer);
                            }
                        });
                        proxy.on("proxyRes", (proxyRes, req, res) => {
                            if (proxyRes.headers['set-cookie']) {
                                proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map((cookie) => {
                                    return cookie
                                        .replace(/Domain=[^;]+/gi, '')
                                        .replace(/SameSite=None/gi, 'SameSite=Lax');
                                });
                            }
                        });
                    },
                },
                "/monitoring": {
                    target: "http://127.0.0.1:8000",
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: (assetInfo) => {
                        let extType = assetInfo.name.split(".").at(1);
                        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                            extType = "img";
                        }
                        return `assets/${extType}/[name]-[hash][extname]`;
                    },
                    chunkFileNames: "assets/js/[name]-[hash].js",
                    entryFileNames: "assets/js/[name]-[hash].js",
                },
            },
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@assets": path.resolve(__dirname, "src/assets"),
                "@components": path.resolve(__dirname, "src/components"),
            },
        },
    };
});
