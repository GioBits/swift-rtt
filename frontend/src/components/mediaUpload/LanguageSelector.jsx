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
    height: "50px",
    minWidth: "30px",
    maxwidth: "120px",
    width  : '100%',
    borderRadius: '4px',
  }

  return (
    <div className="flex flex-row w-full min-w-[410px] m-auto box-border h-full">
      <Box className="flex flex-row w-full gap-20 ml-5 mr-5">
        <FormControl sx={{ minWidth: 30, width: '50%', margin: 'auto', display: 'flex' }}>
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
        <FormControl sx={{ minWidth: 30, width: '50%', margin: 'auto', display: 'flex' }}>
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
