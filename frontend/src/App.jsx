import "./App.css";
import PingComponent from "./components/PingComponent";
import RecordAudio from "./components/RecordAudio";
import UploadAudio from "./components/UploadAudio";
import TranscribeAudio from "./components/TranscribeAudio";

function App() {

  return (
    <>
      <h1>Real Time Translation</h1>
      <div className="UploadAudio">
        <UploadAudio />
        <RecordAudio />
        <TranscribeAudio />
      </div>
      <PingComponent />
      
    </>
  );
}

export default App;
