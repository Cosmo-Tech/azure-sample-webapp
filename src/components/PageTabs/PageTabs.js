// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@mui/material';
import { usePageTabs } from './PageTabsHook';

export const PageTabs = ({ currentTabKey, onTabChange }) => {
  const { tabs } = usePageTabs();

  const handleChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <Tabs value={currentTabKey} onChange={handleChange} aria-label="Page Tabs">
      {tabs.map((tab) => (
        <Tab key={tab.key} label={tab.label} value={tab.key} />
      ))}
    </Tabs>
  );
};

PageTabs.propTypes = {
  currentTabKey: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
