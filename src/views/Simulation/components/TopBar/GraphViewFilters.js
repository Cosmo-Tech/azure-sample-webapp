// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Divider,
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
  const { settings, setSettings } = useSimulationViewContext();
  const [selectedFilters, setSelectedFilters] = useState(settings.graphViewFilters);

  const options = useMemo(() => {
    const listItems = Object.values(GRAPH_VIEW_FILTER_VALUES).map((filterValue) => (
      <MenuItem key={filterValue} value={filterValue}>
        <Checkbox checked={selectedFilters.includes(filterValue)} />
        <ListItemText primary={filterValue} />
      </MenuItem>
    ));
    listItems.splice(1, 0, <Divider key="divider" />);
    return listItems;
  }, [selectedFilters]);

  const changeValue = useCallback(
    (event, child) => {
      const selectedValues = event.target.value;
      const toggledValue = child.props.value;
      let newFilters;

      if (toggledValue === GRAPH_VIEW_FILTER_VALUES.ALL) {
        if (selectedValues.includes(GRAPH_VIEW_FILTER_VALUES.ALL)) newFilters = [GRAPH_VIEW_FILTER_VALUES.ALL];
        else newFilters = [GRAPH_VIEW_FILTER_VALUES.BOTTLENECKS, GRAPH_VIEW_FILTER_VALUES.SHORTAGES];
      } else {
        if (selectedValues.includes(GRAPH_VIEW_FILTER_VALUES.ALL))
          newFilters = selectedValues.filter((value) => value !== GRAPH_VIEW_FILTER_VALUES.ALL);
        else if (selectedValues.length === 0) newFilters = [GRAPH_VIEW_FILTER_VALUES.ALL];
        else newFilters = selectedValues;
      }

      setSelectedFilters(newFilters);

      // Update graph settings asynchronously to prevent UI lags
      setTimeout(() => {
        setSettings((previousSettings) => ({ ...previousSettings, graphViewFilters: newFilters }));
      }, 0);
    },
    [setSelectedFilters, setSettings]
  );

  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel id="graph-view-filter-label">Show</InputLabel>
      <Select
        multiple
        value={selectedFilters}
        onChange={changeValue}
        input={<OutlinedInput label="Show" />}
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
