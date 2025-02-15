import { MediaProvider } from "./contexts/MediaProvider";
import LanguageSelector from "./components/LanguageSelector";
import MediaUpload from "./components/MediaUpload";
import "./index.css";
import MediaResponse from "./components/MediaResponse";

function App() {
  return (
    <div className="bg-neutral-800 h-screen w-screen flex">
      <div className="w-[60vw] h-[70vh] flex m-auto">
        <MediaProvider>
          <div className="w-1/2 h-full flex flex-col m-auto p-4">
            <LanguageSelector />
            <MediaUpload />
          </div>
          <div className="w-1/2 h-full flex flex-col m-auto rounded gap-4">
            <MediaResponse />
          </div>
        </MediaProvider>
      </div>
    </div>
  );
}

export default App;
