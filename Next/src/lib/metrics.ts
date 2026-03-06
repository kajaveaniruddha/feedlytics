import client from "prom-client";

const globalForMetrics = globalThis as unknown as {
  __metricsRegistry: client.Registry;
  __httpRequestDuration: client.Histogram;
  __httpRequestTotal: client.Counter;
};

if (!globalForMetrics.__metricsRegistry) {
  globalForMetrics.__metricsRegistry = new client.Registry();
  client.collectDefaultMetrics({ register: globalForMetrics.__metricsRegistry });

  globalForMetrics.__httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"] as const,
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [globalForMetrics.__metricsRegistry],
  });

  globalForMetrics.__httpRequestTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"] as const,
    registers: [globalForMetrics.__metricsRegistry],
  });
}

export const register = globalForMetrics.__metricsRegistry;
export const httpRequestDuration = globalForMetrics.__httpRequestDuration;
export const httpRequestTotal = globalForMetrics.__httpRequestTotal;

export function withMetrics(
  handler: (...args: any[]) => any,
  route: string,
) {
  return async (request: Request, ...args: any[]) => {
    const end = httpRequestDuration.startTimer();
    let statusCode = 500;

    try {
      const response = await handler(request, ...args);
      statusCode = response.status;
      return response;
    } finally {
      end({ method: request.method, route, status_code: statusCode });
      httpRequestTotal.inc({
        method: request.method,
        route,
        status_code: statusCode,
      });
    }
  };
}
