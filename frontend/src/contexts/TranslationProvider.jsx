import {useState, useEffect } from "react";
import PropTypes from "prop-types";
import idiomas from "../locales/languages.json";
import { setLanguage } from "../utils/languageUtils";
import { TranslationContext } from "./TranslationContext";

export const TranslationProvider = ({ children }) => {

  const [languages, setLanguages] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    setLanguages(idiomas); // Asignar los idiomas a partir del archivo JSON
  }, []);

  const [selectedLanguages, setSelectedLanguages] = useState({
    sourceLanguage: "es",
    targetLanguage: "en",
  });


  const handleSetSourceLanguage = (languageCode) => {
    setLanguage(setSelectedLanguages, "sourceLanguage", languageCode);
  };

  const handleSetTargetLanguage = (languageCode) => {
    setLanguage(setSelectedLanguages, "targetLanguage", languageCode);
  };

  return (
    <TranslationContext.Provider
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
    </TranslationContext.Provider>
  );
};

TranslationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};