// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Drawer } from '@mui/material';
import { useResizableDrawer } from './ResizableDrawerHook';
import { ElementDetails, InspectorHeader } from './components';

const InspectorDrawer = ({ data, selectedElement, clearSelection }) => {
  // Work-around to prevent animation glitch on first time the drawer is opened
  const [, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { width, startResizing } = useResizableDrawer();

  return (
    <Drawer
      anchor="right"
      hideBackdrop
      variant="persistent"
      open={selectedElement != null}
      onClose={clearSelection}
      PaperProps={{ style: { width, position: 'absolute', backgroundColor: `rgba(0,0,0,0)`, backgroundImage: 'none' } }}
      BackdropProps={{ style: { position: 'absolute' } }}
      ModalProps={{
        container: document.getElementById('drawer-container'),
        style: { position: 'absolute' },
        keepMounted: true,
      }}
    >
      <Card
        style={{
          borderRadius: '8px',
          height: '100%',
          marginLeft: '16px',
          padding: '24px',
          overflowX: 'auto',
        }}
      >
        <InspectorHeader selectedElement={selectedElement} clearSelection={clearSelection} />
        <ElementDetails selectedElement={selectedElement} />
      </Card>
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
  selectedElement: PropTypes.object,
  clearSelection: PropTypes.func.isRequired,
};

export default InspectorDrawer;
