import { ConnectionOptions, DefaultJobOptions } from "bullmq";

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: 6379,
};


export const defaultQueueOptions: DefaultJobOptions = {
  removeOnComplete: {
    count: 20,
    age: 60 * 60,
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 3000,
  },
  removeOnFail: false,
};
