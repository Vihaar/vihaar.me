import "./load-env";
import app from "./app";

// Default 8787 so Vite (5173) can proxy /api here in local dev.
const rawPort = process.env["PORT"] ?? "8787";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
