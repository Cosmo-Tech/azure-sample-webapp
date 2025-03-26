import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import DemandsChart from './components/DemandsChart';
import GraphChart from './components/GraphChart';
import StocksChart from './components/StocksChart';

const Echarts = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="visualization tabs">
          <Tab label="Demands" />
          <Tab label="Stocks" />
          <Tab label="Graph" />
        </Tabs>
      </Box>

      {activeTab === 0 && <DemandsChart />}
      {activeTab === 1 && <StocksChart />}
      {activeTab === 2 && <GraphChart />}
    </div>
  );
};

export default Echarts;
