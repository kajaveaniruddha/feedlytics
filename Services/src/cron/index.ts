import { startRetentionCron } from "./retention.cron";

export function startCronJobs() {
  startRetentionCron();
}
