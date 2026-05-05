import express from "express";
import client from "prom-client";
import routes from "./routes";
import { requestLogger } from "./middleware/request-logger";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

export function createApp() {
  const app = express();

  client.collectDefaultMetrics({ register: client.register });

  app.use(express.json());
  app.use(requestLogger);

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
