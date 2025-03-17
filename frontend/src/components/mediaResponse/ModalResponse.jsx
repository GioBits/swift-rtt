import React, { useEffect } from "react"; // Import React and useEffect
import PropTypes from "prop-types"; // Import PropTypes

// Modal Component
const Modal = React.memo(({ isOpen, onClose, children }) => {
  useEffect(() => {
    // This effect will run whenever the props change
  }, [isOpen, onClose, children]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
      <div className="relative rounded-lg w-11/12 max-w-4xl">
        {/* Modal Content */}
        {children}

        {/* Close Button at the Bottom */}
        <div className="flex mt-[10px]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors m-auto mr-0"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
});

// Define PropTypes for the Modal component
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen must be a boolean and is required
  onClose: PropTypes.func.isRequired, // onClose must be a function and is required
  children: PropTypes.node.isRequired, // children must be a React node and is required
};

export default Modal;