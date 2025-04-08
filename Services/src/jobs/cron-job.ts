import cron from "node-cron";

function getRandomMinutes(min: number = 5, max: number = 10): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const messages: string[] = [
  "Just checked in 🕵️‍♂️",
  "Hey there, doing my thing!",
  "Ping! Something happened.",
  "I'm on it! ✅",
  "Another round done!",
  "Time flies, I'm back again!",
  "Routine task wrapped.",
  "Still alive and kickin' 💪",
  "You rang? I showed up.",
  "Running my scheduled duty!"
];

function getRandomMessage(): string {
  const count: number = Math.floor(Math.random() * 3) + 1;
  const result: string[] = [];
  while (result.length < count) {
    const msg: string = messages[Math.floor(Math.random() * messages.length)];
    if (!result.includes(msg)) result.push(msg);
  }
  return result.join(" ");
}

function scheduleRandomJob(): void {
  const interval: number = getRandomMinutes();
  console.log(`Next job scheduled in ${interval} minutes.`);

  setTimeout(() => {
    console.log(getRandomMessage(), "-", new Date().toLocaleTimeString());
    scheduleRandomJob();
  }, interval * 60 * 1000);
}

scheduleRandomJob();
