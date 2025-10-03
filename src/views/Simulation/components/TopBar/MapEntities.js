import React, { useState } from 'react';
import {
  Checkbox,
  MenuItem,
  FormControl,
  Select,
  ListItemText,
  InputLabel,
  Chip,
  Box,
  Typography,
  Switch
} from '@mui/material';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { MAP_ENTITIES } from '../../constants/settings';

export default function MapEntitiesDropdown() {
  const [toggle, setToggle] = useState(false);
  const { selectedEntities, setSelectedEntities } = useSimulationViewContext();

  const handleChange = (event) => {
    const value = event.target.value;

    if (value.includes('all')) {
      setSelectedEntities(MAP_ENTITIES.map((e) => e.value));
    } else {
      setSelectedEntities(value);
    }
  };

  const handleRemove = (value) => {
    if (value === 'all') {
      setSelectedEntities([]);
    } else {
      setSelectedEntities((prev) => prev.filter((v) => v !== value && v !== 'all'));
    }
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const renderValue = (selected) => {
    if (selected.length === 0) return 'Entities';
    if (selected.length === 1) {
      const label = MAP_ENTITIES.find(opt => opt.value === selected[0])?.label;
      return label || 'Entities';
    }
    const firstLabel = MAP_ENTITIES.find(opt => opt.value === selected[0])?.label;
    const moreCount = selected.length - 1;

    console.log('Selected entities:', selected);
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          key={selected[0]}
          label={firstLabel}
          onDelete={() => handleRemove(selected[0])}
          onMouseDown={(e) => e.stopPropagation()}
          color="warning"
          size="small"
        />
        <Chip
          label={`+${moreCount}`}
          size="small"
          sx={{ ml: 1 }}
          color="warning"
        />
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="map-entities-label">Entities</InputLabel>
        <Select
          labelId="map-entities-label"
          multiple
          value={selectedEntities}
          onChange={handleChange}
          renderValue={renderValue}
          label="Entities"
          style={{ padding: 9 }}
        >
          {MAP_ENTITIES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                color="warning"
                checked={selectedEntities.indexOf(option.value) > -1}
              />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}

          {/* Divider / extra row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1 }}>
            <Switch color="warning" checked={toggle} onChange={handleToggle} />
            <Typography variant="body2">Toggle Title</Typography>
          </Box>
        </Select>
      </FormControl>
    </Box>
  );
}
