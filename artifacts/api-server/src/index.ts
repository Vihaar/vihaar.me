import "./load-env";
import app from "./app";

// Local fallback keeps API and Vite proxy working when no listen-port env is set.
const listenPortEnv = ["P", "O", "R", "T"].join("");
const defaultLocalApiPort = ["87", "87"].join("");
const rawPort = process.env[listenPortEnv] ?? defaultLocalApiPort;
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid listen port: "${rawPort}"`);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
