import cron from "node-cron";

cron.schedule('*/10 * * * *', () => {
  console.log("Cron job executed at", new Date());
});