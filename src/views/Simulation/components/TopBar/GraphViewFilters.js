// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { GRAPH_VIEW_FILTER_VALUES } from '../../constants/settings';

export const GraphViewFilters = () => {
  const { requiredUpdateStepsRef, settings, setSettings } = useSimulationViewContext();
  const defaultFilter = Object.values(GRAPH_VIEW_FILTER_VALUES)[0];
  const initialSelected = settings.graphViewFilters?.length > 0 ? settings.graphViewFilters : [defaultFilter];
  const [selectedFilters, setSelectedFilters] = useState(initialSelected);

  // Ensure settings always contain at least one selected item on mount
  useEffect(() => {
    if (!settings.graphViewFilters || settings.graphViewFilters.length === 0) {
      setSettings((prev) => ({
        ...prev,
        graphViewFilters: [defaultFilter],
      }));
    }
  }, [settings.graphViewFilters, defaultFilter, setSettings]);

  const options = useMemo(() => {
    const listItems = Object.values(GRAPH_VIEW_FILTER_VALUES).map((filterValue) => (
      <MenuItem key={filterValue} value={filterValue}>
        <Checkbox checked={selectedFilters.includes(filterValue)} />
        <ListItemText primary={filterValue} />
      </MenuItem>
    ));

    return listItems;
  }, [selectedFilters]);

  const changeValue = useCallback(
    (event) => {
      const selectedValues = event.target.value;

      // Prevent clearing all filters — at least one must remain
      if (selectedValues.length === 0) return;

      setSelectedFilters(selectedValues);

      // Update graph settings asynchronously to prevent UI lags
      setTimeout(() => {
        requiredUpdateStepsRef.current.highlight = true;
        setSettings((previousSettings) => ({
          ...previousSettings,
          graphViewFilters: selectedValues,
        }));
      }, 0);
    },
    [requiredUpdateStepsRef, setSettings]
  );

  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel id="graph-view-filter-label">Highlight</InputLabel>
      <Select
        multiple
        value={selectedFilters}
        onChange={changeValue}
        input={<OutlinedInput label="Highlight" />}
        renderValue={(selectedKeys) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedKeys.map((key) => (
              <Chip key={key} label={key} color="secondary" size="small" />
            ))}
          </Box>
        )}
      >
        {options}
      </Select>
    </FormControl>
  );
};
