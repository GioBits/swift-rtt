import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import WaveSurfer from "wavesurfer.js";
import { IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";

const Confirm = ({ handleConfirmation }) => {

  return (
    <>
      {/* Confirmation and cancellation buttons */}
      <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleConfirmation(false)}
            className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => handleConfirmation(true)}
            className="px-4 py-2 bg-cerulean text-white rounded hover:bg-cerulean/60 hover:cursor-pointer"
          >
            Confirm
          </button>
        </div>
    </>
  );
};

export default Confirm;

// Prop types validation
Confirm.propTypes = {
  handleConfirmation: PropTypes.func.isRequired, // Function to handle confirmation
  file: PropTypes.object.isRequired, // File object to be uploaded
};