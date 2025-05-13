// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '@mui/material';

const InspectorDrawer = ({ open = false, onClose, data }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ height: '100%', backgroundColor: '#232323', textAlign: 'center', padding: '8px' }}>
        inspector drawer placeholder
      </div>
    </Drawer>
  );
};

InspectorDrawer.propTypes = {
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

export default InspectorDrawer;
