import { Widget } from "./components/Widget";

function App() {
  const cfg = window.feedlytics_widget || {};
  return (
    <Widget workspacePublicId={cfg.workspacePublicId} widgetSecret={cfg.widgetSecret} />
  );
}

export default App;
