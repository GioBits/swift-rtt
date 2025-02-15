import { useContext } from "react";
import { Box, FormControl, Select, MenuItem } from "@mui/material";
import { MediaContext } from "../../contexts/MediaContext";

export default function LanguageSelector() {
  const {
    languages,
    selectedLanguages,
    setSourceLanguage,
    setTargetLanguage,
  } = useContext(MediaContext);

  const validSourceLanguage = languages.some(lang => lang.code === selectedLanguages.sourceLanguage)
    ? selectedLanguages.sourceLanguage
    : "";

  const validTargetLanguage = languages.some(lang => lang.code === selectedLanguages.targetLanguage)
    ? selectedLanguages.targetLanguage
    : "";

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

  const selectStyle = {
    fontSize: "14px",
    height: "40px",
    minWidth: "30px",
    maxwidth: "120px",
    width  : '100%',
    margin: 'auto',
    borderRadius: '4px',
  }

  return (
    <div className="flex flex-row w-full max-w-[410px] m-auto bg-white h-[70px] p-10 mb-0 rounded-t-lg">
      <Box className="flex flex-row w-full">
        <FormControl sx={{ minWidth: 30, width: '50%', maxWidth: 145, margin: 'auto', display: 'flex' }}>
          <Select
            id="origin-language-select"
            value={validSourceLanguage}
            onChange={handleOriginChange}
            sx={selectStyle}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 30, width: '50%', maxWidth: 145, margin: 'auto', display: 'flex' }}>
          <Select
            id="target-language-select"
            value={validTargetLanguage}
            onChange={handleTargetChange}
            sx={selectStyle}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
