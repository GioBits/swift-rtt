import { useEffect, useReducer, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { transcriptionService } from '../service/transcribeService';
import { translationService } from '../service/translateService';
import { translatedAudioService } from '../service/translatedAudioService';
import { b64toBlob } from '../utils/audioUtils';
import FormatUtils from '../utils/FormatUtils';
import { languageService } from "../service/languageService";
import axios from 'axios'; 

const INITIAL_FILTERS = {
  date: '',
  size: 10000,
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

const convertToISO = (dateStr) => {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  const dd = day.padStart(2, '0');
  const mm = month.padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const formatFileSize = (size) => {
  const [value, unit] = size.split(' ');
  if (unit === 'KB') return parseInt(value);
  if (unit === 'MB') return parseInt(value) * 1024;
  return 0;
};

export function useHistoryData() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const userId = useSelector(state => state.auth.user?.id);
  const [languages, setLanguages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [maxSize, setMaxSize] = useState(10000);

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
        const response = await axios.get(`http://localhost:8000/api/process-media?page=1&size=10`);
        const audiosResponse = response.data;
        const rows = audiosResponse.items.map(audio => {
          return {
            id: audio.id,
            name: FormatUtils.removeExtension(audio.audio_metadata.filename),
            size: FormatUtils.formatFileSize(audio.audio_metadata.file_size),
            languageFrom: languages[audio.audio_metadata.language_id] || "Desconocido",
            languageTo: languages[audio.languages_to] || "Desconocido",
            date: FormatUtils.formatDateWithLeadingZeros(audio.audio_metadata.created_at),
            time: FormatUtils.formatTimeWithLeadingZeros(audio.audio_metadata.created_at),
          };
        });

        dispatch({ type: 'SET_HISTORY', payload: rows.reverse() });

        const maxSizeValue = Math.max(...rows.map(row => formatFileSize(row.size)));
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

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const onFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredHistoryData = state.historyData.filter(item => {
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const itemISODate = convertToISO(item.date);
    const matchesDate = !filters.date || itemISODate === filters.date;
    const matchesSize = formatFileSize(item.size) <= filters.size;
    const matchesSourceLanguage = filters.sourceLanguage === 'all' || item.languageFrom === filters.sourceLanguage;
    console.log(item.languageTo, filters.destinationLanguage);
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
