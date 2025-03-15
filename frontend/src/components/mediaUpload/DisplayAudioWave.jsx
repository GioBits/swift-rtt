import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import WaveSurfer from "wavesurfer.js";
import { IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const DisplayAudioWave = ({ file }) => {
  const waveformRef = useRef(null); // Reference for the waveform container
  const wavesurferRef = useRef(null); // Reference for the WaveSurfer instance
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing
  const [duration, setDuration] = useState(0); // Total duration of the audio
  const [currentTime, setCurrentTime] = useState(0); // Elapsed time
  const [playbackRate, setPlaybackRate] = useState(1.0); // Playback speed

  // Function to shorten the file name if it's too long
  const shortenFileName = (fileName, maxLength = 20) => {
    if (fileName.length > maxLength) {
      return `${fileName.substring(0, maxLength)}...`; // Truncate and add ellipsis
    }
    return fileName;
  };

  // Function to format time in minutes and seconds
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Initialize WaveSurfer when the file changes
  useEffect(() => {
    if (file && waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current, // Container for the waveform
        waveColor: "#ccc", // Color of the waveform
        progressColor: "#1c6e8c", // Color of the progress bar
        cursorColor: "#1c6e8c", // Color of the cursor
        barWidth: 2, // Width of the waveform bars
        barHeight: 1, // Height of the waveform bars
        responsive: true, // Make the waveform responsive
        height: 50, // Height of the waveform
      });

      // Load the audio file
      wavesurfer.load(URL.createObjectURL(file));
      wavesurferRef.current = wavesurfer;

      // Event when audio starts playing
      wavesurfer.on("play", () => setIsPlaying(true));

      // Event when audio is paused
      wavesurfer.on("pause", () => setIsPlaying(false));

      // Event when audio finishes playing
      wavesurfer.on("finish", () => setIsPlaying(false));

      // Event to update the total duration of the audio
      wavesurfer.on("ready", () => {
        setDuration(wavesurfer.getDuration());
      });

      // Event to update the elapsed time
      wavesurfer.on("audioprocess", () => {
        setCurrentTime(wavesurfer.getCurrentTime());
      });

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

  // Function to increase playback speed
  const increaseSpeed = () => {
    const newRate = Math.min(playbackRate + 0.25, 2.0); // Maximum limit of 2.0x
    setPlaybackRate(newRate);
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(newRate);
    }
  };

  // Function to decrease playback speed
  const decreaseSpeed = () => {
    const newRate = Math.max(playbackRate - 0.25, 0.5); // Minimum limit of 0.5x
    setPlaybackRate(newRate);
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(newRate);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* File name */}
      <Tooltip title={file?.name} arrow>
        <p className="text-sm text-gray-600 mb-4">
          Selected file: <strong className="hover:cursor-pointer">{shortenFileName(file?.name)}</strong>
        </p>
      </Tooltip>

      {/* Main container */}
      <div className="w-full h-20">
        <div className="flex flex-row gap-2 bg-blueMetal/10 w-full rounded-2xl h-full">
          {/* Play/pause button */}
          <div className=" rounded-full flex m-auto mx-2">
            <Tooltip title={isPlaying ? "Pausa" : "Reproducir"} arrow>
              <IconButton
                onClick={handlePlayPause}
                sx={{ width: "64px", height: "64px" }}
              >
                {isPlaying ? <PauseIcon sx={{ fontSize: "48px", color: '#1c6e8c' }} /> : <PlayArrowIcon sx={{ fontSize: "48px", color: '#1c6e8c' }} />}
              </IconButton>
            </Tooltip>
          </div>

          {/* Waveform and controls */}
          <div className="w-full mr-2 my-2">
            <div ref={waveformRef} className="h-7/9 cursor-pointer box-border"></div>
            <div className="flex justify-between">
              {/* Elapsed time and duration with tooltip */}
              <Tooltip title="Tiempo reproducido/Duración del audio" arrow>
                <div className="flex text-xs text-gray-600 h-2/9">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </Tooltip>

              {/* Speed control */}
              <div className="flex justify-between w-18">
                <Tooltip title="Disminuir velocidad de reproducción" arrow>
                  <IconButton
                    onClick={decreaseSpeed}
                    disabled={playbackRate <= 0.5}
                    style={{ width: "16px", height: "16px" }} // Fixed size for the button
                  >
                    <RemoveIcon />
                  </IconButton>
                </Tooltip>
                <span className="text-xs text-gray-600">{playbackRate}x</span>
                <Tooltip title="Aumentar velocidad de reproducción" arrow>
                  <IconButton
                    onClick={increaseSpeed}
                    disabled={playbackRate >= 2.0}
                    style={{ width: "16px", height: "16px" }} // Fixed size for the button
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayAudioWave;

// PropTypes validation
DisplayAudioWave.propTypes = {
  file: PropTypes.object.isRequired, // Audio file
};