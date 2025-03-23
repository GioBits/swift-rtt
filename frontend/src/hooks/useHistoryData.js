import { useEffect, useReducer, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import audioService from '../service/audioService';
import { transcriptionService } from '../service/transcribeService';
import { translationService } from '../service/translateService';
import { translatedAudioService } from '../service/translatedAudioService';
import { b64toBlob } from '../utils/audioUtils';
import FormatUtils from '../utils/FormatUtils';
import { languageService } from "../service/languageService";

// Definimos INITIAL_FILTERS fuera del hook para mantener su referencia constante
const INITIAL_FILTERS = {
  date: '',
  duration: 30,
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

// Función para convertir fecha de "DD/MM/YYYY" a "YYYY-MM-DD"
const convertToISO = (dateStr) => {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  // Asegurarse de que el día y mes tengan dos dígitos
  const dd = day.padStart(2, '0');
  const mm = month.padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

// Funcion inversa de formatFileSize para devolver un int en KB recibiendo un string que dice "X KB" o "X MB"
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
        const rows = audiosResponse.map(audio => {
          return {
            id: audio.id,
            name: FormatUtils.removeExtension(audio.filename),
            size:  FormatUtils.formatFileSize(audio.file_size),
            duration: audio.duration, 
            language: languages[audio.language_id] || "Desconocido",
            date: FormatUtils.formatDateWithLeadingZeros(audio.created_at), // Formato DD/MM/YYYY
            time: FormatUtils.formatTimeWithLeadingZeros(audio.created_at),
          };
        });

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
    const matchesSourceLanguage = filters.sourceLanguage === 'all' || item.language === filters.sourceLanguage;
    return matchesSearchQuery && matchesDate && matchesSize && matchesSourceLanguage;
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
    onFiltersChange 
  };
}
