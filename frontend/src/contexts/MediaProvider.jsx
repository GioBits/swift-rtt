import { useState, useEffect, useRef } from "react";
import { MediaContext } from "./MediaContext";
import { setLanguage } from "../utils/languageUtils";
import { languageService } from "../service/languageService";
import { providerService } from "../service/providerService";
import WebSocketService from "../service/websocketService";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';

export const MediaProvider = ({ children }) => {
  const [audioUrl, setAudioUrl] = useState("");
  const [audioTranslation, setAudioTranslation] = useState("");
  const [languages, setLanguages] = useState([]);
  const [providers, setProvider] = useState([]);
  const [transcription, setTranscription] = useState("");
  const [translate, setTranslate] = useState("");
  const [wsResponse, setWsResponse] = useState("");
  const wsServiceRef = useRef(null);
  const uploadingRef = useRef(false);
  const userId = useSelector(state => state.auth.user.id);

  const getUploading = () => uploadingRef.current;
  const setUploading = (value) => {
    uploadingRef.current = value;
  };

  const [selectedLanguages, setSelectedLanguages] = useState({
    sourceLanguage: 2,
    targetLanguage: 1,
  });
  const [audioSelected, setAudioSelected] = useState({
    id: "",
    audio_data: "",
  })

  useEffect(() => {
    if (!wsServiceRef.current || wsServiceRef.current.userId !== userId) {
      wsServiceRef.current = new WebSocketService(userId);
    }

    const handleMessage = (messageData) => {
      setWsResponse(messageData);
      console.log("Mensaje recibido:", messageData);
    };

    const wsServiceInstance = wsServiceRef.current;
    wsServiceInstance.onMessage(handleMessage);

    return () => {
      wsServiceInstance.offMessage(handleMessage);
    };
  }, [userId])

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
        audioUrl,
        setAudioUrl,
        audioSelected,
        setAudioSelected,
        transcription,
        setTranscription,
        translate,
        setTranslate,
        audioTranslation,
        setAudioTranslation,
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