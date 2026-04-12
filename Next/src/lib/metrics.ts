import client from "prom-client";

const globalForMetrics = globalThis as unknown as {
  __metricsRegistry: client.Registry;
  __httpRequestDuration: client.Histogram;
  __httpRequestTotal: client.Counter;
  __rateLimitBlocked: client.Counter;
  __memoryGaugesRegistered: boolean;
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

if (!globalForMetrics.__memoryGaugesRegistered) {
  globalForMetrics.__memoryGaugesRegistered = true;

  new client.Gauge({
    name: "nodejs_memory_rss_bytes",
    help: "Resident Set Size in bytes",
    registers: [globalForMetrics.__metricsRegistry],
    collect() { this.set(process.memoryUsage().rss); },
  });

  new client.Gauge({
    name: "nodejs_memory_heap_used_bytes",
    help: "V8 heap used in bytes",
    registers: [globalForMetrics.__metricsRegistry],
    collect() { this.set(process.memoryUsage().heapUsed); },
  });

  new client.Gauge({
    name: "nodejs_memory_heap_total_bytes",
    help: "V8 heap total in bytes",
    registers: [globalForMetrics.__metricsRegistry],
    collect() { this.set(process.memoryUsage().heapTotal); },
  });

  new client.Gauge({
    name: "nodejs_memory_external_bytes",
    help: "Memory used by C++ objects bound to JS",
    registers: [globalForMetrics.__metricsRegistry],
    collect() { this.set(process.memoryUsage().external); },
  });

  new client.Gauge({
    name: "nodejs_memory_arraybuffers_bytes",
    help: "Memory for ArrayBuffers and SharedArrayBuffers",
    registers: [globalForMetrics.__metricsRegistry],
    collect() { this.set(process.memoryUsage().arrayBuffers); },
  });
}

if (!globalForMetrics.__rateLimitBlocked) {
  globalForMetrics.__rateLimitBlocked = new client.Counter({
    name: "rate_limit_blocked_total",
    help: "Total number of requests blocked by rate limiter",
    labelNames: ["path"] as const,
    registers: [globalForMetrics.__metricsRegistry],
  });
}

export const register = globalForMetrics.__metricsRegistry;
export const httpRequestDuration = globalForMetrics.__httpRequestDuration;
export const httpRequestTotal = globalForMetrics.__httpRequestTotal;
export const rateLimitBlocked = globalForMetrics.__rateLimitBlocked;

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
