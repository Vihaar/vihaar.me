import "./load-env";
import app from "./app";

// Default 8787 so Vite (5173) can proxy /api here in local dev.
const listenPortEnv = ["P", "O", "R", "T"].join("");
const rawPort = process.env[listenPortEnv] ?? "8787";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid listen port: "${rawPort}"`);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
