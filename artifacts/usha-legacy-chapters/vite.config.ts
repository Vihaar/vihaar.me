import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/usha/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && {
      name: "dev-pictures-redirect",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          if (req.url === "/pictures" || req.url === "/pictures/" || req.url.startsWith("/pictures?") || req.url.startsWith("/pictures/?")) {
            res.statusCode = 302;
            const normalized = req.url.replace(/^\/pictures\/?/, "/pictures");
            res.setHeader("Location", `/usha${normalized}`);
            res.end();
            return;
          }
          next();
        });
      },
    },
    mode === "development" && {
      name: "dev-picture-labels-writer",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method !== "POST" || req.url !== "/__admin/picture-labels") {
            next();
            return;
          }

          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });

          req.on("end", () => {
            try {
              const parsed = JSON.parse(body) as { labels?: Record<string, string>; order?: string[] };
              if (!parsed.labels || typeof parsed.labels !== "object") {
                res.statusCode = 400;
                res.end("Invalid payload");
                return;
              }
              const order = Array.isArray(parsed.order) ? parsed.order.filter((value): value is string => typeof value === "string") : [];

              const filePath = path.resolve(__dirname, "public/usha-pictures/labels.json");
              fs.writeFileSync(filePath, JSON.stringify({ labels: parsed.labels, order }, null, 2) + "\n", "utf-8");
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.statusCode = 500;
              res.end("Failed to save labels");
            }
          });
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
