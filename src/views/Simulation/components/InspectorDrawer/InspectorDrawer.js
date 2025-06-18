// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Drawer, Typography } from '@mui/material';
import { useResizableDrawer } from './ResizableDrawerHook';
import { ElementDetails, InspectorHeader, ProductionOperationsList } from './components';

const InspectorDrawer = ({ selectedElement, setSelectedElement }) => {
  // Work-around to prevent animation glitch on first time the drawer is opened
  const [, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selectedSubElement, setSelectedSubElement] = useState(null);
  // Reset selected sub-operation when another element is selected
  useEffect(() => setSelectedSubElement(null), [selectedElement]);

  const handleCloseButtonClick = useCallback(() => {
    if (selectedSubElement != null) setSelectedSubElement(null);
    else setSelectedElement(null);
  }, [selectedSubElement, setSelectedElement, setSelectedSubElement]);

  const { width, startResizing } = useResizableDrawer();

  const inspectedElement = useMemo(() => selectedSubElement ?? selectedElement, [selectedElement, selectedSubElement]);
  const isResource = useMemo(() => inspectedElement?.operationsCount != null, [inspectedElement]);

  const detailsSubtitle = useMemo(() => {
    return isResource ? (
      <Typography variant="h6" fontWeight="fontWeightBold" sx={{ mb: 2 }}>
        Details
      </Typography>
    ) : null;
  }, [isResource]);

  const operationsSubtitle = useMemo(() => {
    return isResource ? (
      <Typography variant="h6" fontWeight="fontWeightBold" sx={{ my: 2 }}>
        Production operations
      </Typography>
    ) : null;
  }, [isResource]);

  return (
    <Drawer
      anchor="right"
      hideBackdrop
      variant="persistent"
      open={selectedElement != null}
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
        <InspectorHeader selectedElement={inspectedElement} handleCloseButtonClick={handleCloseButtonClick} />
        {detailsSubtitle}
        <ElementDetails selectedElement={inspectedElement} />
        {operationsSubtitle}
        <ProductionOperationsList selectedElement={inspectedElement} setSelectedSubElement={setSelectedSubElement} />
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
  selectedElement: PropTypes.object,
  setSelectedElement: PropTypes.func.isRequired,
};

export default InspectorDrawer;
