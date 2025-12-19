// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Pencil, Play, Plus } from 'lucide-react';
import React from 'react';
import { Button } from '@mui/material';
import { PageHeader } from '../../../components/PageHeader';

export default {
  title: 'Molecules/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: { control: 'text' },
    createdLabel: { control: 'text' },
    createdDate: { control: 'text' },
    runTypeLabel: { control: 'text' },
    runTypeValue: { control: 'text' },
    onInfoHoverText: { control: 'text' },
  },
};

const Template = (args) => (
  <div style={{ padding: '24px', backgroundColor: '#F4F6F8' }}>
    <PageHeader {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: '1.4 Scheduling Priority Change',
  createdLabel: 'Created:',
  createdDate: '7th Oct 2025',
  runTypeLabel: 'Run type:',
  runTypeValue: 'Run What If',
  onInfoHoverText: 'Information about this scenario.',
  leftContext: <span style={{ color: '#6C7A89', fontSize: '12px' }}>NYC Subway › Scenarios ›</span>,
  actions: [
    <Button key="edit" startIcon={<Pencil size={16} />} variant="default" state="enabled">
      Add/Edit
    </Button>,
    <Button key="run" startIcon={<Play size={16} />} variant="highlighted" sx={{ background: '#F3A420' }}>
      Run Scenario
    </Button>,
    <Button key="new" startIcon={<Plus size={16} />} variant="default" state="enabled">
      New
    </Button>,
  ],
};

export const WithLongTitle = Template.bind({});
WithLongTitle.args = {
  ...Default.args,
  title:
    'This is a very long scenario title that may wrap into multiple lines depending on the container width and layout',
};

export const WithNoActions = Template.bind({});
WithNoActions.args = {
  ...Default.args,
  actions: [],
};
