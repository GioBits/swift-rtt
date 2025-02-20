import { MediaProvider } from "./contexts/MediaProvider";
import LanguageSelector from "./components/mediaUpload/LanguageSelector";
import MediaUpload from "./components/mediaUpload/MediaUpload";
import "./index.css";
import MediaResponse from "./components/mediaResponse/MediaResponse";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="bg-neutral-800 h-screen w-screen flex">
      <div>
        <Toaster />
      </div>
      <div className="w-[60vw] h-[80vh] gap-6 lg:flex m-auto block overflow-auto">
        <MediaProvider>
          <div className="lg:w-1/2 w-full h-full flex flex-col m-auto bg-white rounded-lg">
            {/* Title */}
            <div className="box-border bg-sky-300 flex flex-row items-center gap-2 h-[140px] text-6xl p-4 rounded-t-lg">
              <div className="text-5xl text-black font-bold text-center">
                REAL TIME TRANSLATOR
              </div>
            </div>

            {/*Providers */}
            <div className="box-border h-[80px] bg-emerald-500 text-3xl font-bold text-center flex items-center justify-center">
              CARRUSSEL PROVEEDORES
            </div>

            {/* LanguageSelector */}
            <div className="box-border flex h-[80px] w-full m-auto">
              <LanguageSelector />
            </div>

            {/* Dropfile and RecordAudio Upload */}
            <div className=" h-[calc(100%-300px)]">
              <MediaUpload />
            </div>
          </div>

          {/* App Response */}
          <div className="lg:w-1/2 w-full h-full flex flex-col m-auto rounded gap-4">
            <MediaResponse />
          </div>
        </MediaProvider>
      </div>
    </div>
  );
}

export default App;
