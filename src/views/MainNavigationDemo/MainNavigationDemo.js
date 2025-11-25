// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { MainNavigation } from '../../components/MainNavigation';

export const MainNavigationDemo = () => {
  const [activeSection, setActiveSection] = useState('data');
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [drawerWidth, setDrawerWidth] = useState(320);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setActiveScenarioId(null);
  };

  const handleScenarioChange = (scenarioId) => {
    setActiveScenarioId(scenarioId);
  };

  const handleUserMenuClick = () => {
    console.log('User menu clicked');
  };

  return (
    <>
      <MainNavigation
        activeSection={activeSection}
        activeScenarioId={activeScenarioId}
        onSectionChange={handleSectionChange}
        onScenarioChange={handleScenarioChange}
        onUserMenuClick={handleUserMenuClick}
        onDrawerWidthChange={setDrawerWidth}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f5f5f5',
          overflow: 'auto',
          marginLeft: `var(--main-navigation-width, ${drawerWidth}px)`,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        <Paper sx={{ p: 4, maxWidth: 800 }}>
          <Typography variant="h4" gutterBottom>
            MainNavigation Component Demo
          </Typography>
          <Typography variant="body1" paragraph>
            This page demonstrates the MainNavigation component.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Current State:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Active Section:</strong> {activeSection}
            </Typography>
            <Typography variant="body2">
              <strong>Active Scenario ID:</strong> {activeScenarioId || 'None'}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default MainNavigationDemo;
