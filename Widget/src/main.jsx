import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// window.feedlytics_widget = { username: "aniii" };
const init = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);

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
      createRoot(container).render(
        <StrictMode>
          <div>
            <style>{cssText}</style>
            <App />
          </div>
        </StrictMode>
      );
    });
};

init();
