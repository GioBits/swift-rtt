import { useEffect, useReducer, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import audioService from '../service/audioService';
import { transcriptionService } from '../service/transcribeService';
import { translationService } from '../service/translateService';
import { translatedAudioService } from '../service/translatedAudioService';
import { b64toBlob } from '../utils/audioUtils';
import FormatUtils from '../utils/FormatUtils';
import { languageService } from "../service/languageService";
import processMediaService from '../service/processMediaService';

const INITIAL_FILTERS = {
  date: '',
  size: 100,
  sourceLanguage: 'all',
  destinationLanguage: 'all',
};

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [maxSize, setMaxSize] = useState(100);

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

  const statusEmojis = {
    "done": "✅",
    "fail": "❌",
    "process": "⏳",
  };

  useEffect(() => {
    const fetchAudiosByUserId = async () => {
      if (!userId || Object.keys(languages).length === 0) return;

      try {
        const audiosResponse = await audioService.getAudiosByUserId(userId);
        const response = await processMediaService.getProcessMediaByUserAll(userId);
        console.log('response1', response);
        const processMediaResponse = response.data;
        const rows = processMediaResponse.items.map(audio => {
          return {
            id: audio.audio_id,
            name: FormatUtils.removeExtension(audio.audio_metadata.filename),
            size: FormatUtils.formatFileSize(audio.audio_metadata.file_size),
            languageFrom: languages[audio.audio_metadata.language_id] || "Desconocido",
            languageTo: languages[audio.languages_to] || "Desconocido",
            date: FormatUtils.formatDateWithLeadingZeros(audio.audio_metadata.created_at),
            time: FormatUtils.formatTimeWithLeadingZeros(audio.audio_metadata.created_at),
            status: statusEmojis[audio.status],
          };
        });

        dispatch({ type: 'SET_HISTORY', payload: rows.reverse() });

        const maxSizeValue = Math.max(...rows.map(row => FormatUtils.formatFileSizeRemove(row.size)));
        setMaxSize(maxSizeValue);
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
        translatedAudioService.getTranslatedAudioByAudioId(row.id),
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

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const onFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredHistoryData = state.historyData.filter(item => {
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const itemISODate = FormatUtils.convertToISO(item.date);
    const matchesDate = !filters.date || itemISODate === filters.date;
    const matchesSize = FormatUtils.formatFileSizeRemove(item.size) <= filters.size;
    const matchesSourceLanguage = filters.sourceLanguage === 'all' || item.languageFrom === filters.sourceLanguage;
    const matchesDestinationLanguage = filters.destinationLanguage === 'all' || item.languageTo === filters.destinationLanguage;
    return matchesSearchQuery && matchesDate && matchesSize && matchesSourceLanguage && matchesDestinationLanguage;
  });

  return { 
    historyData: filteredHistoryData, 
    state, 
    onRowClick, 
    closeModal, 
    searchQuery, 
    onSearchChange, 
    initialFilters: INITIAL_FILTERS, 
    filters, 
    onFiltersChange,
    maxSize
  };
}
