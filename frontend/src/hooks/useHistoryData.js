import { useEffect, useReducer, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import audioService from '../service/audioService';
import { transcriptionService } from '../service/transcribeService';
import { translationService } from '../service/translateService';
import { translatedAudioService } from '../service/translatedAudioService';
import { b64toBlob } from '../utils/audioUtils';
import FormatUtils from '../utils/FormatUtils';
import { languageService } from "../service/languageService";

const initialState = {
  historyData: [],
  isModalOpen: false,
  selectedAudio: "",
  transcription: "",
  translation: "",
  mediaTranslation: "",
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_HISTORY':
      return { ...state, historyData: action.payload };
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true, ...action.payload };
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, selectedAudio: "", transcription: "", translation: "", mediaTranslation: "" };
    default:
      return state;
  }
}

export function useHistoryData() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const userId = useSelector(state => state.auth.user?.id);
  const [languages, setLanguages] = useState({});

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await languageService.getLanguages();
        const languageMap = data.reduce((acc, lang) => {
          acc[lang.id] = lang.name;
          return acc;
        }, {});
        setLanguages(languageMap);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    const fetchAudiosByUserId = async () => {
      if (!userId || Object.keys(languages).length === 0) return;

      try {
        const audiosResponse = await audioService.getAudiosByUserId(userId);
        const rows = audiosResponse.map(audio => ({
          id: audio.id,
          name: FormatUtils.removeExtension(audio.filename),
          size: FormatUtils.formatFileSize(audio.file_size),
          language: languages[audio.language_id] || "Desconocido",
          date: FormatUtils.formatDateWithLeadingZeros(audio.created_at),
          time: FormatUtils.formatTimeWithLeadingZeros(audio.created_at),
        }));

        dispatch({ type: 'SET_HISTORY', payload: rows.reverse() });
      } catch (error) {
        console.error("Error obteniendo audios:", error);
      }
    };

    fetchAudiosByUserId();
  }, [userId, languages]); 

  const onRowClick = useCallback(async (row) => {
    if (!row.id) return;
    try {
      const [audioResponse, transcriptionResponse, translationResponse, translatedAudioResponse] = await Promise.all([
        audioService.getAudioById(row.id),
        transcriptionService.getTranscriptionByAudioId(row.id),
        translationService.getTranslationByAudioId(row.id),
        translatedAudioService.getTranslatedAudioByAudioId(row.id)
      ]);

      dispatch({
        type: 'OPEN_MODAL',
        payload: {
          selectedAudio: b64toBlob(audioResponse.audio_data),
          transcription: transcriptionResponse.transcription,
          translation: translationResponse.translation,
          mediaTranslation: b64toBlob(translatedAudioResponse.audioData),
        }
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }, []);

  const closeModal = () => dispatch({ type: 'CLOSE_MODAL' });

  return { historyData: state.historyData, state, onRowClick, closeModal };
}