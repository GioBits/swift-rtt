import { useState, useEffect, useContext } from "react";
import { MediaContext } from "../../contexts/MediaContext";
import { Box, MenuItem, FormControl, Select, IconButton } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import Typewriter from "typewriter-effect";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";

const MediaText = ({ title, response, models }) => {
  const { audioUrl } = useContext(MediaContext);
  const [selectedModel, setSelectedModel] = useState("");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (models.length > 0) {
      setSelectedModel(models[0].id);
    }
  }, [models]);

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const togglePlayback = () => {
    setPlaying((prev) => !prev);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const link = document.createElement("a");
    link.href = audioUrl;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute("download", `audio-${timestamp}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white w-full h-1/2 border p-5 rounded-lg">
      <div className="w-full flex flex-col h-[120px] box-border">
        <div className="bg-sky-600 flex w-full h-1/2 rounded">
          <div className="m-auto text-3xl text-white">{title}</div>
        </div>
        <div className="flex flex-row w-full m-auto">
          <div className="flex w-full">
            <Box className="m-auto mr-0">
              <FormControl
                sx={{
                  minWidth: 120,
                  width: "200px",
                  margin: "auto",
                  display: "flex",
                }}
              >
                <Select
                  id="model-select"
                  value={selectedModel}
                  onChange={handleModelChange}
                  displayEmpty
                  sx={{
                    fontSize: "14px",
                    height: "50px",
                    width: "200px",
                    margin: "auto",
                    border: "none",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
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
          <div className="w-[40px] m-auto">
            <RefreshIcon sx={{ fontSize: "42px" }} />
          </div>
        </div>
      </div>
      <div className="h-[calc(100%-150px)]">
        <div className="w-full h-full p-4 border border-dashed border-gray-400 box-border rounded shadow-lg max-h-full overflow-y-auto">
          <Typewriter
            options={{
              strings: response,
              autoStart: true,
              loop: false,
              delay: 12,
              cursor: "",
            }}
          />
        </div>
      </div>
      <div className="h-[50px] flex flex-row">
        <div className="m-auto mr-5">
          <IconButton onClick={togglePlayback}>
          {audioUrl && playing && (
            <ReactPlayer
              url={audioUrl}
              playing={true}
              controls={false}
              width="0"
              height="0"
              className="hidden"
            />
          )}
            <VolumeUpIcon />
          </IconButton>
          <IconButton onClick={handleDownload}>
            <FileDownloadIcon sx={{ marginLeft: "10px" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MediaText;

MediaText.propTypes = {
  title: PropTypes.string.isRequired,
  response: PropTypes.string.isRequired,
  models: PropTypes.array.isRequired,
};
