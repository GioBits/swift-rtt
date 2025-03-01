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
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalProviders = () => {
  const { providers } = useContext(MediaContext);
  
  // Renombramos el estado para reflejar que almacena el modelo seleccionado para cada funcionalidad.
  const [selectedModels, setSelectedModels] = useState({
    transcriptor: '',
    traductor: '',
    speechToText: '',
  });
  const [open, setOpen] = useState(false);

  // Las claves descriptivas de cada selector se nombran de acuerdo a su funcionalidad.
  const modelKeys = useMemo(
    () => ['transcriptor', 'traductor', 'speechToText'],
    []
  );
  
  // Array con las etiquetas que se muestran para cada selector.
  const functionalities = useMemo(
    () => ['Transcriptor', 'Traductor', 'Speech-to-Text'],
    []
  );
  
  // Se obtienen los tipos de proveedores únicos.
  const providerTypes = useMemo(
    () => [...new Set(providers?.map((p) => p.type) || [])],
    [providers]
  );

  // Actualiza el modelo seleccionado para la funcionalidad indicada.
  const handleSelect = useCallback((event, key) => {
    setSelectedModels((prev) => ({ ...prev, [key]: event.target.value }));
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 2 }}>
      <Button variant="contained" onClick={handleOpen}>
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
            <Button variant="outlined" onClick={handleClose} sx={{ mt: 2 }}>
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ModalProviders;