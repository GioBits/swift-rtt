import { useState, useEffect, useRef } from "react";
import { MediaContext } from "./MediaContext";
import { setLanguage } from "../utils/languageUtils";
import { languageService } from "../service/languageService";
import { providerService } from "../service/providerService";
import WebSocketService from "../service/websocketService";
import PropTypes from "prop-types";

const wsService = new WebSocketService();

export const MediaProvider = ({ children }) => {
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaTranslation, setMediaTranslation] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [providers, setProvider] = useState([]);
  const [transcription, setTranscription] = useState("");
  const [translate, setTranslate] = useState("");
  const [wsResponse, setWsResponse] = useState("");
  const uploadingRef = useRef(false);

  const getUploading = () => uploadingRef.current;
  const setUploading = (value) => {
    uploadingRef.current = value;
  };

  const [selectedLanguages, setSelectedLanguages] = useState({
    sourceLanguage: 2,
    targetLanguage: 1,
  });
  const [mediaSelected, setMediaSelected] = useState({
    id: "",
    media_data: "",
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

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await providerService.getProviders();
        setProvider(data);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };

    fetchProvider();
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
        getUploading,
        setUploading,
        mediaUrl,
        setMediaUrl,
        isRecording,
        setIsRecording,
        mediaSelected,
        setMediaSelected,
        transcription,
        setTranscription,
        translate,
        setTranslate,
        mediaTranslation,
        setMediaTranslation,
        providers
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

MediaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};