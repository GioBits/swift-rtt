import "./App.css";
import PingComponent from "./components/PingComponent";
import RecordAudio from "./components/RecordAudio";
import UploadAudio from "./components/UploadAudio";

function App() {

  return (
    <>
      <h1>Real Time Translation</h1>
      <div className="UploadAudio">
        <UploadAudio />
        <RecordAudio />
      </div>
      <PingComponent />
      
    </>
  );
}

export default App;
