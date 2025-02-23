import { useContext, useState } from "react";
import { Box, FormControl, Select, MenuItem, IconButton, Tooltip } from "@mui/material";
import { MediaContext } from "../../contexts/MediaContext";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function LanguageSelector() {
  const {
    languages,
    selectedLanguages,
    setSourceLanguage,
    setTargetLanguage,
  } = useContext(MediaContext);

  const [isFlipped, setIsFlipped] = useState(false);

  const validSourceLanguage = languages.some(
    (lang) => lang.id === selectedLanguages.sourceLanguage
  )
    ? selectedLanguages.sourceLanguage
    : "";

  const validTargetLanguage = languages.some(
    (lang) => lang.id === selectedLanguages.targetLanguage
  )
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

  const handleSwapLanguages = () => {
    const sourceLang = selectedLanguages.sourceLanguage;
    setSourceLanguage(selectedLanguages.targetLanguage);
    setTargetLanguage(sourceLang);
    setIsFlipped((prev) => !prev);
  };

  const selectStyle = {
    fontSize: "14px",
    height: "50px",
    minWidth: "30px",
    maxwidth: "120px",
    width: "100%",
    borderRadius: "4px",
  };

  return (
    <div className="flex flex-row w-full min-w-[410px] m-auto box-border h-full">
      <Box className="flex flex-row w-full gap-5 ml-5 mr-5 items-center justify-center">
        <FormControl sx={{ minWidth: 30, width: "45%", display: "flex" }}>
          <Select
            id="origin-language-select"
            value={validSourceLanguage}
            onChange={handleOriginChange}
            sx={selectStyle}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.id}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title="Intercambiar idiomas" arrow>
          <IconButton
            color="primary"
            size="medium"
            onClick={handleSwapLanguages}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "50%",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.4s ease-in-out",
            }}
          >
            <SwapHorizIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <FormControl sx={{ minWidth: 30, width: "45%", display: "flex" }}>
          <Select
            id="target-language-select"
            value={validTargetLanguage}
            onChange={handleTargetChange}
            sx={selectStyle}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.id}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
