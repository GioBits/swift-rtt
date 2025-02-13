import { useState } from "react";
import { Box, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from '@mui/icons-material/Refresh';
import Typewriter from "typewriter-effect";
import PropTypes from "prop-types";

const MediaText = ({ title, response = 'Esperando texto...', models }) => {
  const [selectedModel, setSelectedModel] = useState("");

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  return (
    <div class="bg-white w-full h-1/2 border p-5 rounded-lg">
      <div class="w-full flex flex-col h-[120px] box-border">
        <div class="bg-sky-600 flex w-full h-1/2 rounded">
          <div class="m-auto text-3xl text-white">{title}</div>
        </div>
        <div class="flex flex-row w-full m-auto">
          <div class="flex w-full">
            <Box class="m-auto mr-0">
              <FormControl sx={{ minWidth: 120, width: '200px', margin: 'auto', display: 'flex' }}>
                <InputLabel id="model-select-label" shrink>Modelos</InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  value={selectedModel}
                  label="Seleccionar Modelo"
                  onChange={handleModelChange}
                  sx={{
                    fontSize: "14px",
                    height: "50px",
                    width: "200px",
                    margin: 'auto',
                    border: 'none',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    }
                  }}
                >
                  {models.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
          <div class="w-[40px] m-auto">
          <RefreshIcon sx={{ fontSize: '42px'}}/>
          </div>
        </div>
      </div>
      <div class="h-[calc(100%-150px)]">
        <div class="w-full h-full p-4 border border-dashed border-gray-400 box-border rounded shadow-lg max-h-full overflow-y-auto">
          <Typewriter
            options={{
              strings: response,
              autoStart: true,
              loop: false,
              delay: 12,
              cursor: ""
            }}
          />
        </div>
      </div>
      <div class="h-[50px] flex flex-row">
        <div class="m-auto mr-5">
          <VolumeUpIcon />
          <FileDownloadIcon sx={{ marginLeft: "10px" }} />
        </div>
      </div>
    </div>
  );
};

export default MediaText;

MediaText.propTypes = {
  title: PropTypes.string.isRequired,
  response: PropTypes.string.isRequired,
  models: PropTypes.array.isRequired, // Prop para los modelos
};
