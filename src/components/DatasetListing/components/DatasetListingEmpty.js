// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import { useUserEmail } from '../../../state/auth/hooks';

export const DatasetListingEmpty = ({ onCreateDataset }) => {
  const userEmail = useUserEmail();
  
  const userName = React.useMemo(() => {
    if (userEmail) {
      const parts = userEmail.split('@')[0].split('.');
      if (parts.length >= 2) {
        return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      }
      return userEmail.split('@')[0];
    }
    return 'Anonymous';
  }, [userEmail]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: 26,
          fontWeight: 700,
          color: '#FFB039',
          mb: 2,
        }}
      >
        Hey {userName}! 👋
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: '#292F33',
          mb: 3,
          maxWidth: '500px',
        }}
      >
        There is no data here yet. You can create a dataset and then add your data to it.
      </Typography>
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

DatasetListingEmpty.propTypes = {
  onCreateDataset: PropTypes.func,
};

DatasetListingEmpty.defaultProps = {
  onCreateDataset: undefined,
};

