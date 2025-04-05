import cron from "node-cron";

cron.schedule('*/5 * * * *', () => {
  console.log("Cron job executed at", new Date());
});