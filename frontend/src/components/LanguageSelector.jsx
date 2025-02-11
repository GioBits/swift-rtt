import { useContext } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { MediaContext } from "../contexts/MediaContext";
import "../styles/LanguageSelector.css";

export default function LanguageSelector() {
  const {
    languages,
    selectedLanguages,
    setSourceLanguage,
    setTargetLanguage,
  } = useContext(MediaContext);

  const handleOriginChange = (event) => {
    const selectedLanguage = event.target.value;
    if (selectedLanguage === selectedLanguages.targetLanguage) {
      setTargetLanguage(selectedLanguages.sourceLanguage);
    }
    setSourceLanguage(selectedLanguage);
  };

  const handleTargetChange = (event) => {
    const selectedLanguage = event.target.value;
    if (selectedLanguage === selectedLanguages.sourceLanguage) {
      setSourceLanguage(selectedLanguages.targetLanguage);
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
          value={selectedLanguages.sourceLanguage}
          label="Idioma de Origen"
          onChange={handleOriginChange}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
        <InputLabel id="target-language-select-label">Idioma de Destino</InputLabel>
        <Select
          labelId="target-language-select-label"
          id="target-language-select"
          value={selectedLanguages.targetLanguage}
          label="Idioma de Destino"
          onChange={handleTargetChange}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
