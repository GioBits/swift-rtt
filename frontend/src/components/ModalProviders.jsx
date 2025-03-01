import React, { useContext, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { MediaContext } from '../contexts/MediaContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalProviders = () => {
  const { providers } = useContext(MediaContext);
  
  const [selectedModels, setSelectedModels] = useState({
    transcriptor: '1',
    traductor: '2',
    speechToText: '3',
  });
  const [open, setOpen] = useState(false);

  const modelKeys = useMemo(
    () => ['transcriptor', 'traductor', 'speechToText'],
    []
  );
  
  const functionalities = useMemo(
    () => ['Transcriptor', 'Traductor', 'Speech-to-Text'],
    []
  );
  
  const providerTypes = useMemo(
    () => [...new Set(providers?.map((p) => p.type) || [])],
    [providers]
  );

  const handleSelect = useCallback((event, key) => {
    setSelectedModels((prev) => ({ ...prev, [key]: event.target.value }));
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box className="w-full ml-5 mr-5 flex">
      <Button 
      sx={{ height: '50px' }}
      variant="contained" onClick={handleOpen} fullWidth>
        Seleccionar Modelos
      </Button>

      <Modal
        aria-labelledby="modal-providers-title"
        aria-describedby="modal-providers-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { timeout: 500 },
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography id="modal-providers-title" variant="h6" component="h2">
              Seleccionar Modelos
            </Typography>
            <Box sx={{ mt: 2 }}>
              {modelKeys.map((key, index) => {
                const type = providerTypes[index % providerTypes.length] || '';
                const options = providers?.filter((p) => p.type === type) || [];
                return (
                  <FormControl key={key} fullWidth sx={{ my: 2 }}>
                    <InputLabel>{functionalities[index]}</InputLabel>
                    <Select
                      value={selectedModels[key]}
                      label={functionalities[index]}
                      onChange={(e) => handleSelect(e, key)}
                    >
                      {options.map((provider) => (
                        <MenuItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              })}
            </Box>
            <Button variant="outlined" onClick={handleClose} sx={{ mt: 2 }} >
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ModalProviders;