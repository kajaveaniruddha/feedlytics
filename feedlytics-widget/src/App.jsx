import { Widget } from "./components/Widget";

function App() {

  return (
    <>
      <Widget username={window.feedlytics_widget.username} />
    </>
  );
}

export default App;
