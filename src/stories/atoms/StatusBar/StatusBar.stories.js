import React from 'react';
import { StatusBar } from '../../../components';

export default {
  title: 'Atoms/StatusBar',
  component: StatusBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['valid', 'invalid', 'edited', 'prerun', 'locked'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'full'],
    },
    message: { control: 'text' },
    tooltip: { control: 'text' },
  },
};

const Template = (args) => <StatusBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  status: 'prerun',
  size: 'medium',
  message: '',
  tooltip: 'Additional information',
};

export const StatusVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <StatusBar status="valid" size="medium" tooltip="Everything looks good" />
    <StatusBar status="invalid" size="medium" tooltip="Something is wrong" />
    <StatusBar status="edited" size="medium" tooltip="You modified this" />
    <StatusBar status="prerun" size="medium" tooltip="Needs to be executed" />
    <StatusBar status="locked" size="medium" tooltip="Read-only access" />
  </div>
);

export const SizeVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <StatusBar status="prerun" size="small" tooltip="Small size" />
    <StatusBar status="prerun" size="medium" tooltip="Medium size" />
    <StatusBar status="prerun" size="full" tooltip="Full width" message="This scenario has not been run yet." />
  </div>
);

export const FullWidthVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
    <StatusBar status="valid" size="full" message="Everything is validated." />
    <StatusBar status="invalid" size="full" message="Scenario contains errors." />
    <StatusBar status="edited" size="full" message="Changes were made." />
    <StatusBar status="prerun" size="full" message="Not executed yet." />
    <StatusBar status="locked" size="full" message="Editing is restricted." />
  </div>
);

export const StatusSizeMatrix = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, auto)',
      gap: 20,
      alignItems: 'center',
    }}
  >
    <strong>Status</strong>
    <strong>Small</strong>
    <strong>Medium</strong>
    <strong>Full</strong>

    {['valid', 'invalid', 'edited', 'prerun', 'locked'].map((status) => (
      <React.Fragment key={status}>
        <div style={{ textTransform: 'capitalize', fontWeight: 600 }}>{status}</div>

        <StatusBar status={status} size="small" tooltip="Small" />

        <StatusBar status={status} size="medium" tooltip="Medium" />

        <StatusBar status={status} size="full" message={`${status} full-width example`} tooltip="Full width" />
      </React.Fragment>
    ))}
  </div>
);

export const TooltipDemo = () => (
  <StatusBar status="edited" size="medium" tooltip="Hover the (?) icon to see the tooltip" />
);
