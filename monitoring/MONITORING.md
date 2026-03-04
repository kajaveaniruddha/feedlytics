# Monitoring with Prometheus and Grafana

Feedlytics includes built-in monitoring via Prometheus and Grafana, available in both development and production.

## Architecture

```
 node-exporter (:9100)  ──┐
                           ├──▶  Prometheus (:9090)  ──▶  Grafana (:3002)
 Next.js (:3000/api/metrics)──┤
                           │
 Services (:3001/metrics) ─┘
```

| Component | Port | What it monitors |
|---|---|---|
| **node-exporter** | 9100 | Host CPU, RAM, disk, network |
| **Next.js /api/metrics** | 3000 | API latency histograms, request counts |
| **Services /metrics** | 3001 | Node.js process metrics (event loop, heap, GC) |
| **Prometheus** | 9090 | Scrapes all the above every 15s |
| **Grafana** | 3002 | Dashboards and visualization |

## Quick Start (Development)

Prometheus, Grafana, and node-exporter are included in the dev compose file:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Once running:

- **Grafana:** http://localhost:3002 (login: `admin` / `admin`)
- **Prometheus:** http://localhost:9090
- **Raw Next.js metrics:** http://localhost:3000/api/metrics
- **Raw Services metrics:** http://localhost:3001/metrics

Grafana is pre-configured with Prometheus as a datasource and a **Feedlytics Overview** dashboard.

## Pre-built Dashboard

The **Feedlytics Overview** dashboard includes:

### VPS / System Metrics (from node-exporter)
- CPU Usage %
- RAM Usage %
- Disk Usage %

### API Metrics (from Next.js)
- API Latency p99 / p95 / p90 for `/api/get-analytics`
- API Request Rate by method and status code
- API Latency p99 across all instrumented routes
- Total Requests by status code

## Instrumenting Additional API Routes

To add metrics to any Next.js API route, use the `withMetrics` helper:

```typescript
// Before
export async function GET(request: Request) {
  // ... your handler logic
}

// After
import { withMetrics } from "@/lib/metrics";

async function handler(request: Request) {
  // ... your handler logic
}

export const GET = withMetrics(handler, "/api/your-route-name");
```

The `withMetrics` wrapper automatically tracks:
- Request duration (as a histogram for percentile calculations)
- Request count (with method, route, and status_code labels)

New routes will automatically appear in Grafana's "All Routes" panel.

## Useful Prometheus Queries

Run these in Prometheus (http://localhost:9090) or in Grafana's Explore tab:

### API Latency Percentiles

```promql
# p99 latency for get-analytics
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{route="/api/get-analytics"}[5m]))

# p95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{route="/api/get-analytics"}[5m]))

# p90
histogram_quantile(0.90, rate(http_request_duration_seconds_bucket{route="/api/get-analytics"}[5m]))
```

### Request Rate

```promql
# Requests per second for a specific route
rate(http_requests_total{route="/api/get-analytics"}[5m])

# Total request rate across all routes
sum(rate(http_requests_total[5m])) by (route)

# Error rate (5xx responses)
sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (route)
```

### System Metrics

```promql
# CPU usage %
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# RAM usage %
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk usage %
(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100
```

## File Reference

| File | Purpose |
|---|---|
| `Next/src/lib/metrics.ts` | Metrics registry, histogram, counter, `withMetrics` helper |
| `Next/src/app/api/metrics/route.ts` | Exposes `/api/metrics` endpoint |
| `Services/index.ts` | Services `/metrics` endpoint (prom-client default metrics) |
| `monitoring/prometheus.dev.yml` | Prometheus scrape config for development |
| `monitoring/prometheus.yml` | Prometheus scrape config for production |
| `monitoring/grafana/provisioning/datasources/prometheus.yml` | Auto-configures Prometheus datasource |
| `monitoring/grafana/provisioning/dashboards/feedlytics-overview.json` | Pre-built dashboard |
