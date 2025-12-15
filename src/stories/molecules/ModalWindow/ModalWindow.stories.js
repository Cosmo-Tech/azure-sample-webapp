// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Table, Share } from 'lucide-react';
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { ModalWindow } from '../../../components';

export default {
  title: 'Molecules/ModalWindow',
  component: ModalWindow,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    width: { control: 'text' },
  },
};

const Template = (args) => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div style={{ padding: '40px' }}>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open Modal
      </Button>

      <ModalWindow
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        selectedTabIndex={selectedTab}
        onTabChange={setSelectedTab}
        alignLastTabRight={false}
      />
    </div>
  );
};

const iconStyle = { size: 18 };

const exampleTabs = [
  {
    key: 'current',
    labelKey: 'layouts.tabs.dashboard.tab.title',
    defaultLabel: 'Current tab',
    icon: <Share {...iconStyle} />,
    render: <Box p={2}>Dashboard content</Box>,
  },
  {
    key: 'additional',
    labelKey: 'layouts.tabs.tables.tab.title',
    defaultLabel: 'Additional tab',
    icon: <Table {...iconStyle} />,
    render: <Box p={2}>Tables content</Box>,
  },
];

export const Default = Template.bind({});
Default.args = {
  title: 'Modal Window Title',
  description: 'Modal window description or additional context',
  tabs: exampleTabs,
  children: exampleTabs[0].render,
};

export const WithoutTabs = Template.bind({});
WithoutTabs.args = {
  title: 'Simple Modal',
  description: 'This modal has no tabs.',
  tabs: [],
  children: <Box p={3}>This is simple modal content</Box>,
};

export const RunningScenario = Template.bind({});
RunningScenario.args = {
  title: 'Running Scenario',
  description: 'Please wait while we run this scenario',
  width: '500px',
  tabs: [],
  children: (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          border: '6px solid #F3A420',
          borderRadius: '4px',
        }}
      />
    </Box>
  ),
};
