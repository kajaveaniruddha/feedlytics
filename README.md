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
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/BullMQ-FF0000?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Nodemailer-yellow?logo=gmail&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-000000?logo=groq&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-EF007B?logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/TanStack%20Query-FF4154?logo=reactquery&logoColor=white" />
  <img src="https://img.shields.io/badge/TanStack%20Table-000000?logo=data:image/svg+xml;base64,...&logoColor=white" />
  <img src="https://img.shields.io/badge/NextAuth.js-000000?logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Prometheus-E6522C?logo=prometheus&logoColor=white" />
  <img src="https://img.shields.io/badge/Grafana-F46800?logo=grafana&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_SSO-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_SSO-181717?logo=github&logoColor=white" />
</p>

---

## 📌 What is Feedlytics?

> Feedlytics helps teams **collect, manage, and analyze feedback with AI** from users.  
> Users can either submit customizable forms or embed a lightweight chat widget into their apps to collect actionable insights.

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

  - Sentiment detection (Positive / Negative / Neutral)
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

## 📸 Application Working & Screenshots

> ![feedlytics](https://github.com/user-attachments/assets/6c86d36d-1251-431b-a957-e8f6e24f5aea)
> ![flowchart-0](https://github.com/user-attachments/assets/7e93f0e5-11b4-459d-ab53-697ccc42e74a)
> ![image](https://github.com/user-attachments/assets/5d6db0af-1965-4444-a444-ff566610c596)
> ![image](https://github.com/user-attachments/assets/9698e4b9-a736-400d-9e85-52dea7060af9)
> ![image](https://github.com/user-attachments/assets/db8973ad-3909-4013-9c74-d83b9a04c2e8)
> ![image](https://github.com/user-attachments/assets/5c3cae79-4c6a-4693-813f-72b8b1c43589)

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
```
