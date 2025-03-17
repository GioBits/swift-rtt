import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Typewriter from "typewriter-effect";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import DisplayAudioWave from "../mediaUpload/DisplayAudioWave";
import { CircularProgress } from "@mui/material";

const MediaContent = ({
  title,
  contentText,
  audio = null,
  tooltipDownload,
}) => {
  const [copied, setCopied] = useState(false);

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

  const handleCopyText = () => {
    if (contentText) {
      navigator.clipboard.writeText(contentText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
        .catch((error) => {
          console.error("Error al copiar el texto:", error);
        });
    }
  };

  return (
    <div className="flex flex-col bg-white w-full h-130 p-8 gap-y-4 rounded-lg shadow-lg shadow-blueMetal/50">
      <div className="w-full flex flex-col h-[40px] box-border">
        <div className="bg-cerulean flex w-full h-[40px] rounded m-auto">
          <div className="m-auto text-3xl text-white">{title}</div>
        </div>
      </div>

      <div className="h-70 box-border">
        <div className="w-full h-full p-4 border border-dashed border-gray-600 box-border rounded max-h-full overflow-y-auto">
          <Typewriter
            options={{
              strings: contentText || "Cargando...",
              autoStart: true,
              loop: false,
              delay: 12,
              cursor: "",
            }}
          />
        </div>
      </div>

      {audio ? <div className="flex flex-col">
        {/* Integrar DisplayAudioWave */}
        <DisplayAudioWave file={audio} />

        <div className="m-auto w-full flex justify-end">
          <Tooltip title={tooltipDownload} arrow>
            <span>
              <IconButton
                onClick={handleDownload}
                disabled={!audio}
                sx={{
                  opacity: audio ? 1 : 0.5,
                  cursor: audio ? 'pointer' : 'not-allowed',
                }}
              >
                <FileDownloadIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={copied ? "¡Copiado!" : "Copiar texto"} arrow>
            <span>
              <IconButton
                onClick={handleCopyText}
                disabled={!contentText}
                sx={{
                  opacity: contentText ? 1 : 0.5,
                  cursor: contentText ? 'pointer' : 'not-allowed',
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div> : <CircularProgress size={60} color="inherit" className="m-auto" />} 
    </div>
  );
};

export default MediaContent;

MediaContent.propTypes = {
  title: PropTypes.string.isRequired,
  contentText: PropTypes.string.isRequired,
  audio: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  resetTimers: PropTypes.any,
  tooltipTitle: PropTypes.string,
  tooltipDownload: PropTypes.string,
  speed: PropTypes.string.isRequired,
};