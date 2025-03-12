import { useEffect } from 'react'
import { MediaProvider } from "../contexts/MediaProvider";
import LanguageSelector from "../components/mediaUpload/LanguageSelector";
import MediaUpload from "../components/mediaUpload/MediaUpload";
import MediaResponse from "../components/mediaResponse/MediaResponse";
import ModalProviders from "../components/ModalProviders";

const Home = () => {
  useEffect(() => {
      document.title = 'Media Upload'
    }, [])

  return (
    <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] h-[80vh] lg:flex mt-10 m-auto block">
      <MediaProvider>

        {/* Upload Section */}
        <div className="lg:w-1/2 w-full h-full flex flex-col m-auto bg-white rounded-lg shadow-lg shadow-blueMetal/50">
          
          {/* Modal Providers */}
          <div className="box-border h-[80px]  text-3xl font-bold text-center flex items-center justify-center rounded-t-lg">
            <ModalProviders />
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

        <div className='md:h-[50px] md:w-full lg:block lg:w-[50px] lg:h-full  '></div>

        {/* App Response */}
        <div className="lg:w-1/2 w-full h-full flex flex-col m-auto rounded gap-4">
          <MediaResponse />
        </div>
      </MediaProvider>
    </div>
  );
};

export default Home;
