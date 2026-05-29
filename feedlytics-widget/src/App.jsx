import { Widget } from "./components/Widget";

function App() {
  const cfg = window.feedlytics_widget || {};
  return (
    <Widget
      workspacePublicId={
        cfg.workspacePublicId || import.meta.env.VITE_DEV_WORKSPACE_PUBLIC_ID || ""
      }
      widgetSecret={cfg.widgetSecret || import.meta.env.VITE_DEV_WIDGET_SECRET || ""}
    />
  );
}

export default App;
