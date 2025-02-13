import { useContext } from "react";
import { Box, FormControl, Select, MenuItem } from "@mui/material";
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
    <Box className="flex flex-row w-full max-w-[410px] m-auto bg-white h-[70px] p-10 mb-0 rounded-t-lg">
      <FormControl sx={{ minWidth: 120, width: '50%', margin: 'auto', display: 'flex' }}>
        <Select
          id="origin-language-select"
          value={selectedLanguages.sourceLanguage}
          onChange={handleOriginChange}
          sx={{
            fontSize: "14px",
            height: "40px",
            width: "145px",
            margin: 'auto',
            borderRadius: '4px', // Asegura que tenga bordes redondeados
          }}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120, width: '50%', margin: 'auto', display: 'flex' }}>
        <Select
          id="target-language-select"
          value={selectedLanguages.targetLanguage}
          onChange={handleTargetChange}
          sx={{
            fontSize: "14px",
            height: "40px",
            width: "145px",
            margin: 'auto',
            borderRadius: '4px', // Asegura que tenga bordes redondeados
          }}
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
