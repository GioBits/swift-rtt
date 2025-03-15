import { useEffect } from 'react'
import { MediaProvider } from "../contexts/MediaProvider";
import LanguageSelector from "../components/mediaUpload/LanguageSelector";
import MediaUpload from "../components/mediaUpload/MediaUpload";
import ProcessBar from '../components/ProcessBar';
import NavbarComponent from '../components/NavbarComponent'

const Home = () => {
  useEffect(() => {
    document.title = 'Media Upload'
  }, [])

  return (
    <MediaProvider>
      <div className="w-screen h-screen">
        <div className='block w-full h-full'>
          <NavbarComponent />
          <div className='flex flex-row h-[calc(100%-60px)] w-full'>
            <div className='flex m-auto'>
              <div className='hidden md:flex md:w-100'>
                <ProcessBar />
              </div>
              {/* Upload Section */}
              <div className="w-100 h-130 lg:w-150 flex flex-col gap-y-4 bg-white p-8 rounded-lg shadow-lg shadow-blueMetal/50">

                {/* LanguageSelector */}
                <div className="box-border flex h-[40px] w-[100%]">
                  <LanguageSelector />
                </div>
                {/* Dropfile and RecordAudio Upload */}
                <div className="flex flex-col h-full">
                  <MediaUpload />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MediaProvider>
  );
};

export default Home;
