// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Divider, Stack, Typography } from '@mui/material';

// TODO: add options for units & formatting?
const DETAILS_METADATA = {
  id: { label: 'Id' },
  duration: { label: 'Duration' },
  mode: { label: 'Mode' },
  inputQuantity: { label: 'Input quantity' },
  src: { label: 'Source' },
  dest: { label: 'Destination' },

  plantName: { label: 'Plant name' },
  step: { label: 'Step' },
  isInfinite: { label: 'Is infinite', getValue: (value) => (value ? 'Yes' : 'No') },
  initialStock: { label: 'Initial stock' },
  stockPolicy: { label: 'Stock policy' },
  sourcingPolicy: { label: 'Sourcing policy' },
  dispatchPolicy: { label: 'Dispatch policy' },

  productionStep: { label: 'Production step' },
  productionPolicy: { label: 'Production policy' },

  isContractor: { label: 'Is contractor' },
  investmentCost: { label: 'Investment cost' },
};

export const ElementDetails = ({ selectedElement }) => {
  const elementDetails = Object.entries(selectedElement?.data ?? {});

  const getValue = useCallback((attribute, value) => {
    if (DETAILS_METADATA?.[attribute]?.getValue) return DETAILS_METADATA?.[attribute]?.getValue(value);
    return value;
  }, []);

  return (
    <Stack
      spacing={1}
      sx={{ mt: 4, justifyContent: 'space-between', alignItems: 'start' }}
      divider={<Divider flexItem />}
    >
      {elementDetails.map(([attribute, value], index) => (
        <Stack
          spacing={2}
          key={index}
          direction="row"
          sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'start' }}
        >
          <Typography>{DETAILS_METADATA?.[attribute]?.label ?? attribute}</Typography>
          <Typography>{getValue(attribute, value)}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};

ElementDetails.propTypes = {
  selectedElement: PropTypes.object,
};
