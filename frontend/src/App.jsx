import "./App.css";
import PingComponent from "./components/PingComponent";
import { MediaProvider } from "./contexts/MediaProvider";
import TranslationAudio from "./components/TranslationAudio";
import LanguageSelector from "./components/LanguageSelector";
import MediaUpload from "./components/MediaUpload";

function App() {
  return (
    <>
      <MediaProvider>
        <h1>Real Time Translation</h1>
        <LanguageSelector />
        <div className="upload-input">
          <MediaUpload />
        </div>
        <TranslationAudio />
      </MediaProvider>
      <PingComponent />
    </>
  );
}

export default App;
