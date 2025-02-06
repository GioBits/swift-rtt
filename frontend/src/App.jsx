import "./App.css";
import PingComponent from "./components/PingComponent";
import RecordAudio from "./components/RecordAudio";
import UploadAudio from "./components/UploadAudio";
import { TranslationProvider } from "./contexts/TranslationProvider";
import TranslationAudio from "./components/TranslationAudio";


function App() {
  return (
    <>
      <h1>Real Time Translation</h1>
      <TranslationProvider>
        <div className="LanguageSelector">
          {/* <LanguageSelector /> */}
          <h3>Dropdown idiomas aquí</h3>
        </div>
        <div className="upload-input">
          <UploadAudio />
          <RecordAudio />
        </div>
        <TranslationAudio />
      </TranslationProvider>
      <PingComponent />
    </>
  );
}

export default App;
