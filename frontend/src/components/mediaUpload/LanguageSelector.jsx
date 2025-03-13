import { useContext, useState } from "react";
import { Box, FormControl, Select, MenuItem, IconButton, Tooltip, InputLabel } from "@mui/material";
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
    fontSize: "16px",
    height: "32px",
    minWidth: "30px",
    maxwidth: "120px",
    width: "100%",
    borderRadius: "4px",
  };

  return (
    <div className="flex flex-row w-full m-auto box-border h-full">
      <Box className="flex flex-row w-[100%] m-auto items-center justify-center">
        <FormControl variant="standard" sx={{ minWidth: 30, width: "45%", display: "flex" }}>
          <InputLabel id="origin-language-select" sx={{fontSize: '14px'}} shrink>
            Idioma Origen
          </InputLabel>
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
            color="secondary"
            size="medium"
            onClick={handleSwapLanguages}
            sx={{
              borderRadius: "50%",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.4s ease-in-out",
              marginLeft: "10px",
              marginRight: "10px",
              width: "40px",
              height: "40px"
            }}
          >
            <SwapHorizIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <FormControl variant="standard" sx={{ minWidth: 30, width: "45%", display: "flex" }}>
          <InputLabel id="target-language-select" sx={{fontSize: '14px'}} shrink>
            Idioma Destino
          </InputLabel>
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
