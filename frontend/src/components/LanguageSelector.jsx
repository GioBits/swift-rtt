import React, { useContext } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LanguageContext } from '../contexts/LanguageContext.jsx'; // Ensure you import the context
import '../LanguageSelector.css';

export default function LanguageSelector() {
  const { originLanguage, setOriginLanguage, targetLanguage, setTargetLanguage } = useContext(LanguageContext);

  const handleOriginChange = (event) => {
    const selectedLanguage = event.target.value;
    if (selectedLanguage === targetLanguage) {
      setTargetLanguage(originLanguage);
    }
    setOriginLanguage(selectedLanguage);
  };

  const handleTargetChange = (event) => {
    const selectedLanguage = event.target.value;
    if (selectedLanguage === originLanguage) {
      setOriginLanguage(targetLanguage);
    }
    setTargetLanguage(selectedLanguage);
  };

  return (
    <Box className="language-selector">
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="origin-language-select-label">Idioma de Origen</InputLabel>
        <Select
          labelId="origin-language-select-label"
          id="origin-language-select"
          value={originLanguage}
          label="Idioma de Origen"
          onChange={handleOriginChange}
        >
          <MenuItem value=""><em>Seleccione un idioma</em></MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Español</MenuItem>
          {/* Add more languages as needed */}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
        <InputLabel id="target-language-select-label">Idioma de Destino</InputLabel>
        <Select
          labelId="target-language-select-label"
          id="target-language-select"
          value={targetLanguage}
          label="Idioma de Destino"
          onChange={handleTargetChange}
        >
          <MenuItem value=""><em>Seleccione un idioma</em></MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Español</MenuItem>
          {/* Add more languages as needed */}
        </Select>
      </FormControl>
    </Box>
  );
}