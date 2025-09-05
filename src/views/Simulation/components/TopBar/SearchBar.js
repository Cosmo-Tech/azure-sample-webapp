// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useMemo } from 'react';
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
  const { centerToPosition, setSelectedElementId, graphRef, selectedElementId } = useSimulationViewContext();

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

  const selectedElement = useMemo(
    () =>
      options.find((option) => option.id === selectedElementId) ??
      options.find((option) => option.data.id === selectedElementId),
    [selectedElementId, options]
  );

  const selectElement = useCallback(
    (event, element) => {
      const elementId = element?.data?.id ?? element?.id;
      setSelectedElementId(elementId ?? null);
      if (elementId != null) centerToPosition(elementId);
    },
    [centerToPosition, setSelectedElementId]
  );

  return (
    <Autocomplete
      onChange={selectElement}
      value={selectedElement ?? null}
      options={options}
      groupBy={(option) => option.typeLabel}
      getOptionLabel={(option) => option.id ?? option.data.id}
      renderInput={(params) => <TextField {...params} label="Search" />}
    />
  );
};
