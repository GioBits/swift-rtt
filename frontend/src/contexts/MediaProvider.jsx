import { useState, useEffect, useRef } from "react";
import { MediaContext } from "./MediaContext";
import { setLanguage } from "../utils/languageUtils";
import { languageService }  from "../service/languageService";
import WebSocketService  from "../service/websocketService";
import PropTypes from "prop-types";

const wsService = new WebSocketService();

export const MediaProvider = ({ children }) => {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioTranslation, setAudioTranslation] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [transcription, setTranscription] = useState("");
  const [translate, setTranslate] = useState("");
  const [wsResponse, setWsResponse] = useState("");
  
  const [selectedLanguages, setSelectedLanguages] = useState({
    sourceLanguage: "es",
    targetLanguage: "en",
  });
  const [audioSelected, setAudioSelected] = useState({
    id: "",
    audio_data: "",
  })

  const wsServiceRef = useRef(wsService);

  useEffect(() => {
    const handleMessage = (messageData) => {
      setWsResponse(messageData);
      console.log("Mensaje recibido:", messageData);
    };

    const wsServiceInstance = wsServiceRef.current;
    wsServiceInstance.onMessage(handleMessage);

    return () => {
      wsServiceInstance.offMessage(handleMessage);
    };
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await languageService.getLanguages();
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

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
        wsResponse,
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
        setAudioSelected,
        transcription,
        setTranscription,
        translate,
        setTranslate,
        audioTranslation,
        setAudioTranslation
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};