import "dotenv/config";
import { createApp } from "./src/app";
import { logger } from "./src/lib/logger";
import "./src/workers";
import { startCronJobs } from "./src/cron";

const app = createApp();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info({ port }, "Services server started");
});

startCronJobs();
