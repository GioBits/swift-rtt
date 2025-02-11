import { useState, useEffect } from "react";
import { MediaContext } from "./MediaContext";
import { setLanguage } from "../utils/languageUtils";
import languagesSupport from "../locales/languages.json";
import PropTypes from "prop-types";

export const MediaProvider = ({ children }) => {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState({
    sourceLanguage: "es",
    targetLanguage: "en",
  });

  useEffect(() => {
    setLanguages(languagesSupport);
  }, []);


  const handleSetSourceLanguage = (languageCode) => {
    setLanguage(setSelectedLanguages, "sourceLanguage", languageCode);
  };

  const handleSetTargetLanguage = (languageCode) => {
    setLanguage(setSelectedLanguages, "targetLanguage", languageCode);
  };

  return (
    <MediaContext.Provider
      value={{
        languages,
        selectedLanguages,
        setSourceLanguage: handleSetSourceLanguage,
        setTargetLanguage: handleSetTargetLanguage,
        uploading,
        setUploading,
        audioUrl,
        setAudioUrl,
        isRecording,
        setIsRecording
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};