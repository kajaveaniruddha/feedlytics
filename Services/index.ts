import express from "express";
import { emailQueue, feedbackQueue } from "./src/queue";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post("/get-verification-email", async (req: any, res: any) => {
  const { data } = req.body;
  await emailQueue
    .add("sendVerificationEmail", data, {
      removeOnComplete: {
        age: 5, // keep up to 5 seconds
        count: 0, // keep up to 0 jobs
      },
      removeOnFail: {
        age: 5, // keep up to 5seconds
      },
    })
    .then(() => {
      res.send({ status: 200, message: "Mail sent successfully" });
    })
    .catch(() => {
      res.send({ status: 500, message: "Mail not sent due to queue error." });
    });
});

app.post("/add-feedback", async (req: any, res: any) => {
  const { data } = req.body;
  await feedbackQueue
    .add("feedbackQueue", data, {
      removeOnComplete: {
        age: 5, // keep up to 5 seconds
        count: 0, // keep up to 0 jobs
      },
      removeOnFail: {
        age: 5, // keep up to 5seconds
      },
    })
    .then(() => {
      res.send({ status: 200, message: "Feedback added successfully" });
    })
    .catch(() => {
      res.send({
        status: 500,
        message: "Feedback not added due to queue error.",
      });
    });
});

app.get("/health", (req: any, res: any) => {
  res.send("Healthy!");
});

app.get("/health-email", async (req: any, res: any) => {
  await emailQueue
    .add(
      "sendVerificationEmail",
      {
        name: "aniruddha",
        email: "aakajave@gmail.com",
        username: "aniii",
        verifyCode: "888111",
        expiryDate: Date.now(),
      },
      {
        removeOnComplete: {
          age: 5, // keep up to 5 seconds
          count: 0, // keep up to 0 jobs
        },
        removeOnFail: {
          age: 5, // keep up to 5seconds
        },
      }
    )
    .then(() => {
      res.send({ status: 200, message: "Mail sent successfully" });
    })
    .catch(() => {
      res.send({ status: 500, message: "Mail not sent due to queue error." });
    });
});

app.get("/health-feedback", async (req: any, res: any) => {
  await feedbackQueue
    .add(
      "feedbackQueue",
      {
        userId: 8,
        stars: 2,
        content: "Testing feedback queue.",
        sentiment: "positive",
        category: ["praise"],
        createdAt: new Date(),
      },
      {
        removeOnComplete: {
          age: 5, // keep up to 5 seconds
          count: 0, // keep up to 0 jobs
        },
        removeOnFail: {
          age: 5, // keep up to 5seconds
        },
      }
    )
    .then(() => {
      res.send({ status: 200, message: "Feedback added to DB successfully" });
    })
    .catch(() => {
      res.send({ status: 500, message: "Feedback not added to DB due to queue error." });
    });
});

app.listen(port, () => {
  console.log(`BullMQ server running at http://localhost:${port}`);
});

// Start the workers
import("./src/workers/emailWorker");
import("./src/workers/feedbackWorker");
import("./src/workers/slackNotificationWorker");
