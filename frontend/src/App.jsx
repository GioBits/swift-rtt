import { MediaProvider } from "./contexts/MediaProvider";
import LanguageSelector from "./components/LanguageSelector";
import MediaUpload from "./components/MediaUpload";
import "./index.css";
import MediaText from "./components/MediaText";

function App() {
  const models = [
    { id: "1", name: "Modelo 1" },
    { id: "2", name: "Modelo 2" },
    { id: "3", name: "Modelo 3" },
  ];

  return (
    <div className="bg-neutral-800 h-screen w-screen flex">
      <div className="w-[60vw] h-[70vh] flex m-auto">
        <div className="w-1/2 h-full flex flex-col m-auto p-4">
          <MediaProvider>
            <LanguageSelector />
            <MediaUpload />
          </MediaProvider>
        </div>
        <div className="w-1/2 h-full flex flex-col m-auto rounded gap-4">
          <MediaText title="Transcripción" models={models} />
          <MediaText title="Traducción" models={models} />
        </div>
      </div>
    </div>
  );
}

export default App;
