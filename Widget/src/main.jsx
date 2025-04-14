import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// window.feedlytics_widget = { username: "aniii" };
const init = () => {
  // Create widget container and attach shadow DOM for CSS encapsulation
  const chatbotNode = document.createElement("div");
  const shadowRoot = chatbotNode.attachShadow({ mode: "open" });
  document.body.appendChild(chatbotNode);
  
  const urlBotId = window.location.pathname.split("/").pop();
  if (!window.feedlytics_widget.username && urlBotId) {
    window.feedlytics_widget = window.feedlytics_widget || {};
    window.feedlytics_widget.username = urlBotId;
  }

  if (!window.feedlytics_widget.username) {
    throw new Error("Widget is not initialized");
  }

  createRoot(shadowRoot).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

init();
