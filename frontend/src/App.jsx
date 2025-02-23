import { MediaProvider } from "./contexts/MediaProvider";
import LanguageSelector from "./components/mediaUpload/LanguageSelector";
import MediaUpload from "./components/mediaUpload/MediaUpload";
import MediaResponse from "./components/mediaResponse/MediaResponse";
import AccordionProviders from "./components/AccordionProviders";
import { Toaster } from 'react-hot-toast';
import "./index.css";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="bg-[#EFF1F3] h-screen w-screen flex flex-col">
        {/* Navbar */}
        <div className="w-full bg-[#011638] text-white flex items-center justify-between p-4 shadow-lg">
          <div className="text-3xl font-bold">Real Time Translator</div>
        </div>

        {/* Main Content */}
        <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] h-[80vh] gap-6 lg:flex m-auto block">
          <MediaProvider>
            {/* Upload Section */}
            <div className="lg:w-1/2 w-full h-full flex flex-col m-auto bg-white rounded-lg shadow-md">
              {/* Carrusel de proveedores */}
              {/* <div className="box-border flex items-center justify-center gap-2 h-[80px] text-3xl text-black font-semibold">
                Tu voz, en cualquier idioma
              </div> */}
              <div className="box-border h-[80px]  text-3xl font-bold text-center flex items-center justify-center rounded-t-lg">
                <AccordionProviders />
              </div>

              {/* LanguageSelector */}
              <div className="box-border flex h-[80px] w-full m-auto">
                <LanguageSelector />
              </div>

              {/* Dropfile and RecordAudio Upload */}
              <div className="h-[calc(100%-160px)] flex flex-col items-center justify-center">
                <MediaUpload />
              </div>
            </div>

            {/* App Response */}
            <div className="lg:w-1/2 w-full h-full flex flex-col m-auto rounded gap-4">
              <MediaResponse />
            </div>
          </MediaProvider>
        </div>

        {/* Toaster Notifications */}
        <div>
          <Toaster />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
