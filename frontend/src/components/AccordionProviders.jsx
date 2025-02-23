import React, { useContext, useState, useMemo, useCallback } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MediaContext } from '../contexts/MediaContext';

const AccordionProviders = () => {
  const { providers } = useContext(MediaContext);
  const [selections, setSelections] = useState({
    selector1: '',
    selector2: '',
    selector3: '',
  });

  const selectors = useMemo(() => ['selector1', 'selector2', 'selector3'], []);
  const providerTypes = useMemo(
    () => [...new Set(providers?.map((p) => p.type) || [])],
    [providers]
  );

  const handleSelect = useCallback((event, selector) => {
    setSelections((prev) => ({ ...prev, [selector]: event.target.value }));
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 2, position: 'relative' }}>
      <Accordion
        sx={{
          width: '100%',
          position: 'static',
          '&.Mui-expanded': { margin: 0 },
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: 48,
            '&.Mui-expanded': { minHeight: 48 },
          }}
        >
          <Typography variant="subtitle2">Seleccionar Modelos</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            position: 'absolute',
            width: '100%',
            left: 0,
            top: '100%',
            zIndex: 10,
            bgcolor: 'background.paper',
            boxShadow: 3,
            p: 0,
          }}
        >
          <Box sx={{ p: 2 }}>
            {selectors.map((selector, index) => {
              const type = providerTypes[index % providerTypes.length] || '';
              const options = providers?.filter((p) => p.type === type) || [];
              return (
                <FormControl key={selector} fullWidth sx={{ my: 2 }}>
                  <InputLabel>{`Opción ${index + 1}`}</InputLabel>
                  <Select
                    value={selections[selector]}
                    label={`Opción ${index + 1}`}
                    onChange={(e) => handleSelect(e, selector)}
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AccordionProviders;