import { MediaProvider } from "./contexts/MediaProvider";
import LanguageSelector from "./components/mediaUpload/LanguageSelector";
import MediaUpload from "./components/mediaUpload/MediaUpload";
import "./index.css";
import MediaResponse from "./components/mediaResponse/MediaResponse";

function App() {
  return (
    <div className="bg-neutral-800 h-screen w-screen flex">
      <div className="w-[60vw] h-[70vh] lg:flex m-auto block overflow-auto">
        <MediaProvider>
          <div className="lg:w-1/2 w-full h-full flex flex-col m-auto p-4">
            <LanguageSelector />
            <MediaUpload />
          </div>
          <div className="lg:w-1/2 w-full h-full flex flex-col m-auto rounded gap-4">
            <MediaResponse />
          </div>
        </MediaProvider>
      </div>
    </div>
  );
}
export default App;