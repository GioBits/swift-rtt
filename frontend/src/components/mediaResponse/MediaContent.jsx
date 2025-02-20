import { useState, useEffect } from "react";
import { Box, MenuItem, FormControl, Select, IconButton, Tooltip } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import Typewriter from "typewriter-effect";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";

/**
 * `MediaContent` component to display a title, text content (like transcription or translation),
 * and audio with playback and download controls.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to display at the top of the component.
 * @param {string} props.contentText - The textual content (transcription or translation) to display.
 * @param {Array} props.models - List of available models. Each model has an `id` and `name`.
 * @param {string|null} props.audio - The URL of the audio file to play. If `null`, no audio controls will be shown.
 * @param {string} props.placeholder - Placeholder text to show when there is no content available or while it's loading.
 * 
 * @returns {JSX.Element} The component rendering interactive multimedia content.
 */
const MediaContent = ({ title, contentText, models, audio = null, placeholder }) => {
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
    if (!audio) return;
    const link = document.createElement("a");
    link.href = audio;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute("download", `audio-${timestamp}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white w-full h-1/2 border p-5 rounded-lg">
      <div className="w-full flex flex-col h-[120px] box-border">
        <div className="bg-sky-600 flex w-full h-1/2 rounded m-auto">
          <div className="m-auto text-3xl text-white">{title}</div>
        </div>
        <div className="hidden w-full m-auto"> {/* hidden by flex flex-row */}
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
          {contentText ? (
            <Typewriter
              options={{
                strings: contentText,
                autoStart: true,
                loop: false,
                delay: 12,
                cursor: "",
              }}
            />
          ) : (
            <div className="text-slate-500 whitespace-pre-wrap text-4xl">
              {placeholder}
            </div>
          )}
        </div>
      </div>

      <div className="h-[50px] flex flex-row">
        {audio && (
          <div className="m-auto mr-5 flex gap-3">
            <Tooltip title="Reproducir/Pausar audio" arrow>
              <IconButton onClick={togglePlayback}>
                {playing && (
                  <ReactPlayer
                    url={audio}
                    playing={true}
                    controls={false}
                    width="0"
                    height="0"
                    className="hidden"
                  />
                )}
                <VolumeUpIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Descargar audio" arrow>
              <IconButton onClick={handleDownload}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaContent;

MediaContent.propTypes = {
  title: PropTypes.string.isRequired,
  contentText: PropTypes.string.isRequired,
  models: PropTypes.array.isRequired,
  audio: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};
