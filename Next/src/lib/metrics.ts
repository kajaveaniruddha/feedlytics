import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

export const httpRequestTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [register],
});

export { register };

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
