// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { Plus } from 'lucide-react';

export const DatasetListingHeader = ({ onCreateDataset }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        px: 3,
        py: 3,
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontSize: 26,
            fontWeight: 700,
            color: '#292F33',
            mb: 1,
          }}
        >
          Data
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: '#292F33',
          }}
        >
          Upload, edit and validate your data
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<Plus size={16} />}
        onClick={onCreateDataset}
        sx={{
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        Create Dataset
      </Button>
    </Box>
  );
};

DatasetListingHeader.propTypes = {
  onCreateDataset: PropTypes.func,
};

DatasetListingHeader.defaultProps = {
  onCreateDataset: undefined,
};

