import { MediaProvider } from "./contexts/MediaProvider";
import LanguageSelector from "./components/LanguageSelector";
import PingComponent from "./components/PingComponent";
import MediaUpload from "./components/MediaUpload";
import "./index.css";
import MediaText from "./components/MediaText";
import { useSelector } from 'react-redux';

function App() {
  const { message } = useSelector((state) => state.error);
  const models = [
    { id: "1", name: "Modelo 1" },
    { id: "2", name: "Modelo 2" },
    { id: "3", name: "Modelo 3" },
  ];

  return (
    <div className="bg-neutral-800 h-screen w-screen flex">
      <PingComponent />
      <div className="w-[60vw] h-[70vh] flex m-auto">
        <MediaProvider>
          <div className="w-1/2 h-full flex flex-col m-auto p-4">
            <LanguageSelector />
            <MediaUpload />
          </div>
          <div className="w-1/2 h-full flex flex-col m-auto rounded gap-4">
            <MediaText title="Transcripción" response={message || ""} models={models} />
            <MediaText title="Traducción" response={message || ""} models={models} />
          </div>
        </MediaProvider>
      </div>
    </div>
  );
}

export default App;
