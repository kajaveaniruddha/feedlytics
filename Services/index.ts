import express from "express";
import emailQueue from "./src/queue";
import "dotenv/config";

const app = express();
const port = 3001;

app.use(express.json());

app.post("/add-job", async (req: any, res: any) => {
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

app.get("/health", (req: any, res: any) => {
  res.send("Healthy!");
});

app.get("/health-queue", async (req: any, res: any) => {
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

app.listen(port, () => {
  console.log(`BullMQ server running at http://localhost:${port}`);
});

// Start the worker
import("./src/workers/emailWorker");
