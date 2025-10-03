import React from 'react';
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
  Switch,
} from '@mui/material';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { MAP_VIEW_FILTERS } from '../../constants/settings';

export const MapEntitiesDropdown = () => {
  const { selectedMapFilters, setSelectedMapFilters } = useSimulationViewContext();
  const onlyCriticalPointsChecked = selectedMapFilters.includes('onlyCriticalPoints');

  const handleChange = (event) => {
    const value = event.target.value;

    if (value.includes('all')) {
      if (!selectedMapFilters.includes('all')) {
        const allValues = MAP_VIEW_FILTERS.filter((f) => f.type === 'checkbox').map((f) => f.value);
        setSelectedMapFilters(allValues);
      } else {
        setSelectedMapFilters([]);
      }
      return;
    }

    if (selectedMapFilters.includes('all') && !value.includes('all')) {
      setSelectedMapFilters(value.filter((v) => v !== 'all'));
    } else {
      setSelectedMapFilters(value);
    }
  };

  const handleRemove = (value) => {
    if (value === 'all') {
      setSelectedMapFilters([]);
    } else {
      setSelectedMapFilters((prev) => prev.filter((v) => v !== value && v !== 'all'));
    }
  };

  const handleToggleSwitch = (checked) => {
    if (checked) {
      setSelectedMapFilters([...selectedMapFilters, 'onlyCriticalPoints']);
    } else {
      setSelectedMapFilters(selectedMapFilters.filter((v) => v !== 'onlyCriticalPoints'));
    }
  };

  const renderValue = (selected) => {
    if (selected.length === 0) return 'Entities';

    if (selected.length === 1) {
      const label = MAP_VIEW_FILTERS.find((opt) => opt.value === selected[0])?.label || 'Entities';
      return (
        <Chip
          key={selected[0]}
          label={label}
          onDelete={() => handleRemove(selected[0])}
          onMouseDown={(e) => e.stopPropagation()}
          color="warning"
          size="small"
        />
      );
    }

    const firstLabel = MAP_VIEW_FILTERS.find((opt) => opt.value === selected[0])?.label || 'Entities';
    const moreCount = selected.length - 1;

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
        <Chip label={`+${moreCount}`} size="small" sx={{ ml: 1 }} color="warning" />
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="map-entities-label" sx={{ py: 1 }}>
          Entities
        </InputLabel>
        <Select
          labelId="map-entities-label"
          multiple
          value={selectedMapFilters}
          onChange={handleChange}
          renderValue={renderValue}
          label="Entities"
          sx={{ py: 1 }}
        >
          {MAP_VIEW_FILTERS.filter((f) => f.type === 'checkbox').map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox color="warning" checked={selectedMapFilters.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}

          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', my: 1, mx: 3 }} />

          {MAP_VIEW_FILTERS.filter((f) => f.type === 'switch').map((option) => (
            <Box key={option.value} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
              <Switch
                color="warning"
                checked={onlyCriticalPointsChecked}
                onChange={(e) => handleToggleSwitch(e.target.checked)}
              />
              <Typography variant="body2">{option.label}</Typography>
            </Box>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
