<p align="center">
  <a href="https://feedlytics.in"><img src="https://img.shields.io/badge/Live%20Demo-Click%20Here-brightgreen?style=for-the-badge" /></a>
</p>

<h1 align="center">FEEDLYTICS</h1>

<p align="center"><i>Transform Feedback into Actionable Insights Effortlessly</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-yesterday-informational" />
  <img src="https://img.shields.io/badge/typescript-93.5%25-blue" />
  <img src="https://img.shields.io/badge/languages-6-blueviolet" />
</p>

<br/>

<h3 align="center">Built with the tools and technologies:</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Express-black?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/JSON-000000?logo=json&logoColor=white" />
  <img src="https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/Autoprefixer-DD3735?logo=autoprefixer&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/PostCSS-DD3A0A?logo=postcss&logoColor=white" />
  <img src="https://img.shields.io/badge/.ENV-green" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B?logo=nodemon&logoColor=black" />
  <img src="https://img.shields.io/badge/GNU%20Bash-4EAA25?logo=gnubash&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-black?logo=data:image/svg+xml;base64,..." />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/XML-000?logo=xml&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/ts-node-3178C6" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-purple" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=white" />
  <img src="https://img.shields.io/badge/YAML-000?logo=yaml&logoColor=white" />
</p>

---

## 📌 What is Feedlytics?

> Feedlytics helps teams **collect, manage, and analyze feedback with AI** from users.  
Users can either submit customizable forms or embed a lightweight chat widget into their apps to collect actionable insights.

---

## ❓ Problem it Solves

SaaS teams often struggle to gather feedback from multiple sources, make sense of it quickly, and respond on time.  
Spreadsheets, scattered emails, and disconnected tools just don’t scale.

---

## 💡 How Feedlytics Solves It

- 🗂️ **Centralized Feedback Collection**  
  → Collect all feedback in one place using a lightweight React widget or customizable forms.

- 🤖 **AI-Powered Insights**  
  → Auto-analysis with **Groq’s LLM (LLaMA 3.1)** for:
  - Sentiment detection (Positive / Negative)
  - Categorization: Bug, Request, Complaint, Suggestion, Question, Praise, or Other

- 🚨 **Real-Time Alerts**  
  → Trigger instant workflows via **Slack** or **Google Chat** when important feedback arrives.

- 📊 **Smart Dashboard**  
  → Filter, search, and sort through feedback with blazing-fast UI using **TanStack Tables** and **Next.js**.

- 💳 **Built-in Payments**  
  → Integrated with **Stripe** for secure checkouts and plan upgrades.

- ⚙️ **High-Traffic Ready**  
  → Powered by Redis queues, rate limiting, and Bloom filters to handle scale.

- 🌐 **Robust Cloud Deployment**  
  → Deployed with **Docker on AWS EC2**, reverse proxied by **NGINX**, monitored with **Prometheus + Grafana**.

---

## 📸 Application Screenshots

> _Add screenshots and high-level architecture diagram here_

---

## 🚀 Live Demo

👉 [https://feedlytics.in](https://feedlytics.in)

---

## 🧪 Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/feedlytics.git
cd feedlytics

# Create .env files for all services (admin, widget, services)
cp .env.example .env

# Start services using Docker
docker-compose up --build

# OR for local dev:
cd apps/dashboard # or apps/widget
pnpm install
pnpm dev