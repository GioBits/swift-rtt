import { useState, useEffect } from "react";
import { MediaContext } from "./MediaContext";
import { setLanguage } from "../utils/languageUtils";
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
  const [audioSelected, setAudioSelected] = useState({
    id: ""
  })

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/languages");
        const data = await response.json();
        console.log(data);
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages", error);
      }
    }

    fetchLanguages();
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
        setIsRecording,
        audioSelected,
        setAudioSelected
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};