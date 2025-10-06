// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Close as CloseIcon } from '@mui/icons-material/';
import { Card, CardContent, CardHeader, Typography, IconButton, Grid } from '@mui/material';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { BUTTON_BACKGROUND_COLOR } from '../Scene/styleConstants';

const itemLegend = [
  {
    id: 'stocks',
    name: 'Stocks',
    images: {
      graph: '/assets/stock.svg',
    },
    modes: ['graph'],
  },
  {
    id: 'stockShortages',
    name: 'Stock Shortages',
    images: {
      graph: '/assets/stockShortages.svg',
    },
    modes: ['graph'],
  },
  {
    id: 'production',
    name: 'Production Operation',
    images: {
      graph: '/assets/productionOperations.svg',
    },
    modes: ['graph'],
  },
  {
    id: 'productionResources',
    name: 'Production Resources',
    images: {
      graph: '/assets/productionResources.svg',
      map: '/assets/productionResources-map.svg',
    },
    modes: ['graph', 'map'],
  },
  {
    id: 'bottleneck',
    name: 'Bottleneck',
    images: {
      graph: '/assets/bottleneck.svg',
      map: '/assets/bottleneck-map.svg',
    },
    modes: ['graph', 'map'],
  },
  {
    id: 'processRelation',
    name: 'Process relation',
    images: {
      graph: '/assets/processRelation.svg',
    },
    modes: ['graph'],
  },
  {
    id: 'transport',
    name: 'Transport',
    images: {
      graph: '/assets/transport.svg',
      map: '/assets/transport.svg',
    },
    modes: ['graph', 'map'],
  },
];

export const ChartLegendCard = ({ onClose }) => {
  const { viewMode } = useSimulationViewContext();

  const visibleLegendItems = useMemo(() => {
    return itemLegend.filter((item) => item.modes.includes(viewMode));
  }, [viewMode]);

  return (
    <Card sx={{ my: 1, borderRadius: '8px' }}>
      <CardHeader
        action={
          <IconButton onClick={onClose} aria-label="Close legend">
            <CloseIcon />
          </IconButton>
        }
        title="Legend"
        sx={{
          backgroundColor: BUTTON_BACKGROUND_COLOR,
          fontSize: '16px',
          fontWeight: 600,
          padding: '12px 16px',
          borderRadius: 0,
        }}
        titleTypographyProps={{
          sx: {
            fontSize: '16px',
            fontWeight: 600,
          },
        }}
      />
      <CardContent
        sx={{
          backgroundColor: BUTTON_BACKGROUND_COLOR,
          padding: '12px 16px',
          borderRadius: '0 0 8px 8px',
          '&:last-child': {
            paddingBottom: '12px',
          },
        }}
      >
        <Grid container sx={{ width: 230 }} alignItems="center">
          {visibleLegendItems.map((item) => (
            <React.Fragment key={item.id}>
              <Grid item container xs={4} sx={{ my: 1, minHeight: 32 }} justifyContent={'center'}>
                <img src={item.images[viewMode]} alt={`${item.name} legend icon`} />
              </Grid>
              <Grid item container xs={8} sx={{ pl: 1 }} justifyContent={'flex-start'}>
                <Typography variant="body2">{item.name}</Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

ChartLegendCard.propTypes = {
  onClose: PropTypes.func.isRequired,
};
