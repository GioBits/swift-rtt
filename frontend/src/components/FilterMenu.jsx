import { useState, useEffect } from "react";
import { Box, FormControl, Slider, TextField, Select, MenuItem } from "@mui/material";

export default function FilterMenu({ initialFilters, onFiltersChange }) {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (event) => {
    const newFilters = { ...filters, [event.target.name]: event.target.value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSliderChange = (name) => (event, newValue) => {
    const newFilters = { ...filters, [name]: newValue };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Box className="w-full flex flex-col gap-4 mt-5" sx={{ boxSizing: 'border-box' }}>
      <FormControl>
        <label>Fecha</label>
        <TextField
          id="date-input"
          name="date"
          type="date"
          size="small"
          fullWidth
          value={filters.date}
          onChange={handleFilterChange}
          sx={{ height: '40px' }}
        />
      </FormControl>

      <FormControl>
        <label>Duración: {filters.duration} seg</label>
        <Slider
          value={filters.duration}
          onChange={handleSliderChange("duration")}
          min={10}
          max={30}
          step={1}
          valueLabelDisplay="auto"
          sx={{ width: "100%", mt: 1 }}
        />
      </FormControl>

      <FormControl>
        <label>Tamaño: {filters.size} KB</label>
        <Slider
          value={filters.size}
          onChange={handleSliderChange("size")}
          min={1}
          max={10000}
          step={1}
          valueLabelDisplay="auto"
          sx={{ width: "100%", mt: 1 }}
        />
      </FormControl>

      <FormControl>
        <label>Idioma de Origen</label>
        <Select
          name="sourceLanguage"
          value={filters.sourceLanguage}
          onChange={handleFilterChange}
          fullWidth
          size="small"
          sx={{ height: '40px' }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="English">Inglés</MenuItem>
          <MenuItem value="Español">Español</MenuItem>
          <MenuItem value="Italiano">Italiano </MenuItem>
          <MenuItem value="Chino">Chino </MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <label>Idioma de Destino</label>
        <Select
          name="destinationLanguage"
          value={filters.destinationLanguage}
          onChange={handleFilterChange}
          fullWidth
          size="small"
          sx={{ height: '40px' }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="en">Inglés</MenuItem>
          <MenuItem value="es">Español</MenuItem>
          <MenuItem value="fr">Francés</MenuItem>
          <MenuItem value="zh">Chino</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
