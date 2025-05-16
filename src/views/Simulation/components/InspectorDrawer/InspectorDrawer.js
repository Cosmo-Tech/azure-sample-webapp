// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '@mui/material';
import { useResizableDrawer } from './ResizableDrawerHook';

const InspectorDrawer = ({ data, onClose, open = true }) => {
  // Work-around to prevent animation glitch on first time the drawer is opened
  const [, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { width, startResizing } = useResizableDrawer();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ style: { width, position: 'absolute', backgroundColor: `rgba(0,0,0,0)`, backgroundImage: 'none' } }}
      BackdropProps={{ style: { position: 'absolute' } }}
      ModalProps={{
        container: document.getElementById('drawer-container'),
        style: { position: 'absolute' },
        keepMounted: true,
      }}
    >
      <div
        style={{
          borderRadius: '8px',
          height: '100%',
          backgroundColor: '#232323',
          textAlign: 'center',
          marginLeft: '16px',
          padding: '8px',
        }}
      >
        inspector drawer placeholder
      </div>
      <div
        onMouseDown={startResizing}
        style={{
          cursor: 'ew-resize',
          backgroundColor: '#232323',
          position: 'absolute',
          top: 'calc(50% - 15px)',
          width: '16px',
          height: '30px',
          borderWidth: 'thin',
          borderColor: '#777777',
          borderStyle: 'none solid none none',
        }}
      >
        <div style={{ textAlign: 'center', padding: '1px' }}>||</div>
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
