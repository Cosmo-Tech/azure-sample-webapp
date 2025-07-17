// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowForwardIos as ArrowForwardIosIcon } from '@mui/icons-material';
import { Icon, MenuItem, Stack, Typography } from '@mui/material';
import { useSimulationViewContext } from '../../../SimulationViewContext';

export const ProductionOperationsList = ({ inspectedElement, setSelectedSubElement }) => {
  const { graphRef } = useSimulationViewContext();
  const operationsIds = useMemo(() => inspectedElement?.operations ?? [], [inspectedElement]);

  const selectOperation = useCallback(
    (idOfOperationToSelect) => {
      const operations = graphRef.current?.operations;
      if (!operations) return;

      const operation = operations.find((element) => element.id === idOfOperationToSelect);
      if (!operation) return;

      setSelectedSubElement(operation);
    },
    [graphRef, setSelectedSubElement]
  );

  const getListItem = useCallback(
    (operationId, index) => {
      return (
        <MenuItem
          key={operationId}
          divider
          disableGutters
          sx={{ width: '100%' }}
          onClick={() => selectOperation(operationId)}
        >
          <Stack
            spacing={2}
            key={index}
            direction="row"
            sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography>{operationId}</Typography>
            <div>
              <Icon>
                <ArrowForwardIosIcon fontSize="small" />
              </Icon>
            </div>
          </Stack>
        </MenuItem>
      );
    },
    [selectOperation]
  );

  return inspectedElement != null ? (
    <Stack sx={{ justifyContent: 'space-between', alignItems: 'start' }}>{operationsIds.map(getListItem)}</Stack>
  ) : null;
};

ProductionOperationsList.propTypes = {
  inspectedElement: PropTypes.object,
  setSelectedSubElement: PropTypes.func.isRequired,
};
