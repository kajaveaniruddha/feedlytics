import dotenv from "dotenv";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "..");
const envDevelopmentPath = path.join(repoRoot, ".env.development");
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: envDevelopmentPath });
}
import { env } from "./src/config/env";
import { createApp } from "./src/app";
import { logger } from "./src/lib/logger";
import "./src/workers";
import { startQueueGrpcServer } from "./src/grpc/feedback-grpc-server";
import { flushAnalysisCallbacksOnShutdown } from "./src/services/ai-analysis-callback-batcher";

const app = createApp();
const port = env.PORT;

app.listen(port, () => {
  logger.info({ port }, "Services server started");
});

startQueueGrpcServer(env.GRPC_PORT);

async function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down");
  try {
    await flushAnalysisCallbacksOnShutdown();
  } catch (err) {
    logger.error({ err: String(err) }, "Flush on shutdown failed");
  }
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
