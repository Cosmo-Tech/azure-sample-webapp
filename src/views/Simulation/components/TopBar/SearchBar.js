// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useSimulationViewContext } from '../../SimulationViewContext';

const HIDDEN_TYPES = ['compounds'];
const TYPE_LABELS = {
  input: 'Input',
  output: 'Output',
  transports: 'Transports',
  productionResource: 'Production resources',
  productionOperation: 'Production operations',
  stock: 'Stocks',
};

export const SearchBar = () => {
  const { centerToPosition, graphRef } = useSimulationViewContext();

  const options = useMemo(() => {
    if (graphRef.current == null) return [];

    const allElements = [];
    [...graphRef.current.nodes, ...graphRef.current.links].forEach((element) => {
      if (HIDDEN_TYPES.includes(element.type)) return;
      allElements.push({ ...element, typeLabel: TYPE_LABELS[element.type] });
    });

    return allElements.sort((a, b) => {
      return -b.typeLabel.localeCompare(a.typeLabel);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphRef.current?.nodes]);

  const selectElement = (element) => {
    if (element == null) return;
    if (element.x != null && element.y != null) centerToPosition(-element.x, -element.y);
    if (element.source != null && element.target != null) {
      const centerX = (element.source.x + element.target.x) / 2.0;
      const centerY = (element.source.y + element.target.y) / 2.0;
      centerToPosition(-centerX, -centerY);
    }
  };

  return (
    <Autocomplete
      onChange={(event, data) => selectElement(data)}
      options={options}
      groupBy={(option) => option.typeLabel}
      getOptionLabel={(option) => option.id ?? option.data.id}
      renderInput={(params) => <TextField {...params} label="Search" />}
    />
  );
};
