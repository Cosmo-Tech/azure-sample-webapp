// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Close as CloseIcon } from '@mui/icons-material/';
import { Card, CardContent, CardHeader, Typography, IconButton, Grid } from '@mui/material';
import { BUTTON_BACKGROUND_COLOR } from '../Scene/styleConstants';

const itemLegend = [
  {
    id: 'stocks',
    name: 'Stocks',
    image: '/assets/stock.svg',
  },
  {
    id: 'stockShortages',
    name: 'Stock Shortages',
    image: '/assets/stockShortages.svg',
  },
  {
    id: 'production',
    name: 'Production Operation',
    image: '/assets/productionOperations.svg',
  },
  {
    id: 'productionResources',
    name: 'Production Resources',
    image: '/assets/productionResources.svg',
  },
  {
    id: 'bottleneck',
    name: 'Bottleneck',
    image: '/assets/bottleneck.svg',
  },
  {
    id: 'processRelation',
    name: 'Process relation',
    image: '/assets/processRelation.svg',
  },
  {
    id: 'transport',
    name: 'Transport',
    image: '/assets/transport.svg',
  },
];

export const ChartLegendCard = ({ onClose }) => {
  return (
    <Card sx={{ my: 1 }}>
      <CardHeader
        action={
          <IconButton onClick={onClose} aria-label="Close legend">
            <CloseIcon />
          </IconButton>
        }
        title="Legend"
        style={{ backgroundColor: BUTTON_BACKGROUND_COLOR }}
      />
      <CardContent
        style={{
          backgroundColor: BUTTON_BACKGROUND_COLOR,
        }}
      >
        <Grid container sx={{ width: 230 }} alignItems="center">
          {itemLegend.map((item) => (
            <React.Fragment key={item.id}>
              <Grid item container xs={4} sx={{ my: 1, minHeight: 32 }} justifyContent={'center'}>
                <img src={item.image} />
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
