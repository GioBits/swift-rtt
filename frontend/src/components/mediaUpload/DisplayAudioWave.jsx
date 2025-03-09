import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import WaveSurfer from "wavesurfer.js";
import { IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";

const Confirm = ({ file }) => {
  const waveformRef = useRef(null); // Reference for the waveform container
  const wavesurferRef = useRef(null); // Reference for the WaveSurfer instance
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing

  // Function to shorten the file name if it's too long
  const shortenFileName = (fileName, maxLength = 20) => {

    if (fileName.length > maxLength) {
      return `${fileName.substring(0, maxLength)}...`; // Truncate and add ellipsis
    }
    return fileName;
  };

  // Initialize WaveSurfer when the file changes
  useEffect(() => {
    if (file && waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current, // Container for the waveform
        waveColor: "#011638", // Color of the waveform
        progressColor: "#1c6e8c", // Color of the progress bar
        cursorColor: "#011638", // Color of the cursor
        barWidth: 2, // Width of the waveform bars
        barHeight: 1, // Height of the waveform bars
        responsive: true, // Make the waveform responsive
      });

      // Load the audio file
      wavesurfer.load(URL.createObjectURL(file));
      wavesurferRef.current = wavesurfer;

      // Event listener for when audio starts playing
      wavesurfer.on("play", () => setIsPlaying(true));

      // Event listener for when audio is paused
      wavesurfer.on("pause", () => setIsPlaying(false));

      // Event listener for when audio finishes playing
      wavesurfer.on("finish", () => setIsPlaying(false));

      // Cleanup function to destroy WaveSurfer instance when the component unmounts
      return () => {
        wavesurfer.destroy();
      };
    }
  }, [file]);

  // Function to play or pause the audio
  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  // Function to stop the audio
  const handleStop = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setIsPlaying(false); // Set playing state to false
    }
  };

  return (
    
    <div className="flex flex-col items-center w-full">
    
    {/* Display the file name with a tooltip */}
    <Tooltip title={file?.name} arrow>
        <p className="text-sm text-gray-600 mb-4 cursor-pointer">
        Selected file: <strong>{shortenFileName(file?.name)}</strong>
        </p>
    </Tooltip>

    {/* Waveform visualization */}
    <div ref={waveformRef} className="w-full h-32 mb-1 bg-gray-300 cursor-pointer"></div>

    {/* Playback controls with icons and tooltips */}
    <div className="flex gap-2 mt-1">
        <Tooltip title={isPlaying ? "Pause" : "Play"} arrow>
        <IconButton
            onClick={handlePlayPause}
            color="primary"
            aria-label={isPlaying ? "Pause" : "Play"}
        >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        </Tooltip>
        <Tooltip title="Stop" arrow>
        <IconButton
            onClick={handleStop}
            color="secondary"
            aria-label="Stop"
        >
            <StopIcon />
        </IconButton>
        </Tooltip>
    </div>

    </div>
  
  );
};

export default Confirm;

// Prop types validation
Confirm.propTypes = {
  file: PropTypes.object.isRequired, // File object to be uploaded
};