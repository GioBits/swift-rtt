import "./App.css";
import PingComponent from "./components/PingComponent";
import RecordAudio from "./components/RecordAudio";
import UploadAudio from "./components/UploadAudio";
import { MediaProvider } from "./contexts/MediaProvider";
import TranslationAudio from "./components/TranslationAudio";
import LanguageSelector from "./components/LanguageSelector";

function App() {
  return (
    <>
      <MediaProvider>
        <h1>Real Time Translation</h1>
        <LanguageSelector />
        <div className="upload-input">
          <UploadAudio />
          <RecordAudio />
        </div>
        <TranslationAudio />
      </MediaProvider>
      <PingComponent />
    </>
  );
}

export default App;
