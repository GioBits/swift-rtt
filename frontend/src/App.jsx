import "./App.css";
import PingComponent from "./components/PingComponent";
import RecordAudio from "./components/RecordAudio";
import UploadAudio from "./components/UploadAudio";
import { TranslationProvider } from "./contexts/TranslationProvider";
import TranslationAudio from "./components/TranslationAudio";
import { LanguageProvider } from "./contexts/LanguageContext";
import LanguageSelector from "./components/LanguageSelector";

function App() {
  return (
    <>
      <h1>Real Time Translation</h1>
      <LanguageProvider>
        <div className="LanguageSelector">
          <LanguageSelector />
        </div>
        <TranslationProvider>
          <div className="upload-input">
            <UploadAudio />
            <RecordAudio />
          </div>
          <TranslationAudio />
        </TranslationProvider>
      </LanguageProvider>
      <PingComponent />
    </>
  );
}

export default App;
