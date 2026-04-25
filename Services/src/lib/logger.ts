type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

const currentLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= (LEVELS[currentLevel] ?? LEVELS.info);
}

function formatMessage(level: LogLevel, context: Record<string, unknown>, message?: string): string {
  const timestamp = new Date().toISOString();
  const parts = [`[${timestamp}]`, `[${level.toUpperCase()}]`];
  if (message) parts.push(message);
  const contextKeys = Object.keys(context);
  if (contextKeys.length > 0) parts.push(JSON.stringify(context));
  return parts.join(" ");
}

export const logger = {
  debug(context: Record<string, unknown>, message?: string) {
    if (shouldLog("debug")) console.debug(formatMessage("debug", context, message));
  },

  info(context: Record<string, unknown>, message?: string) {
    if (shouldLog("info")) console.log(formatMessage("info", context, message));
  },

  warn(context: Record<string, unknown>, message?: string) {
    if (shouldLog("warn")) console.warn(formatMessage("warn", context, message));
  },

  error(context: Record<string, unknown>, message?: string) {
    if (shouldLog("error")) console.error(formatMessage("error", context, message));
  },
};
