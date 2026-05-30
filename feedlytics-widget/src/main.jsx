import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { applyWidgetScriptDataset } from "./lib/read-bootstrap-dataset";
import { FEEDLYTICS_API_BASE_URL } from "./lib/utils";

window.feedlytics_widget = window.feedlytics_widget || {};

const init = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const cfg = window.feedlytics_widget;
  const urlSegment = window.location.pathname.split("/").filter(Boolean).pop();

  applyWidgetScriptDataset(cfg);

  if (!cfg.workspacePublicId && urlSegment && /^[0-9a-f-]{36}$/i.test(urlSegment)) {
    cfg.workspacePublicId = urlSegment;
  }

  if (!FEEDLYTICS_API_BASE_URL) {
    throw new Error(
      "Feedlytics widget: API base URL is empty. Set VITE_FEEDLYTICS_API_BASE_URL at build time or edit FEEDLYTICS_API_BASE_URL in src/lib/utils.js.",
    );
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
        </StrictMode>,
      );
    });
};

init();
