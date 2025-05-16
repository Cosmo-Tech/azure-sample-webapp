// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '@mui/material';

const InspectorDrawer = ({ data, onClose, open = true }) => {
  // Work-around to prevent animation glitch on first time the drawer is opened
  const [, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ style: { position: 'absolute' } }}
      BackdropProps={{ style: { position: 'absolute' } }}
      ModalProps={{
        container: document.getElementById('drawer-container'),
        style: { position: 'absolute' },
        keepMounted: true,
      }}
    >
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
