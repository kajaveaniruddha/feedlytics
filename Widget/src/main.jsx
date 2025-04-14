import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

window.feedlytics_widget = { username: "aniii" };
const init = () => {
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

  fetch(new URL("./index.css", import.meta.url))
    .then((res) => res.text())
    .then((cssText) => {
      const styleTag = document.createElement("style");
      styleTag.textContent = cssText;
      shadowRoot.appendChild(styleTag);

      createRoot(shadowRoot).render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    });
};

init();
