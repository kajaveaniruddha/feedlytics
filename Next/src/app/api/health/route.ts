const MEMORY_LIMIT = 768 * 1024 * 1024;
const WARNING_THRESHOLD = 0.85;

export async function GET() {
  const mem = process.memoryUsage();
  const uptime = process.uptime();

  return Response.json({
    status: mem.rss < MEMORY_LIMIT * WARNING_THRESHOLD ? "healthy" : "warning",
    uptime_seconds: Math.floor(uptime),
    memory: {
      rss_mb: Math.round(mem.rss / 1024 / 1024),
      heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
      external_mb: Math.round(mem.external / 1024 / 1024),
      array_buffers_mb: Math.round(mem.arrayBuffers / 1024 / 1024),
    },
    limits: {
      container_memory_mb: 768,
      v8_heap_max_mb: 512,
      warning_threshold_percent: 85,
    },
  });
}
