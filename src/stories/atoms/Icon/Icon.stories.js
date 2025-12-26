import React from 'react';
import { Icon } from '../../../components';
import { Icons } from '../../utils';

export default {
  title: 'Atoms/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: Icons.map(({ name }) => name),
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 2 },
    },
    color: {
      control: 'color',
    },
    strokeWidth: {
      control: { type: 'number', min: 1, max: 4, step: 0.5 },
    },
    className: {
      control: false,
    },
  },
};

const Template = (args) => (
  <div
    style={{
      backgroundColor: '#F4F6F8',
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Icon {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  name: 'Search',
};

export const Large = Template.bind({});
Large.args = {
  name: 'User',
  size: 32,
};

export const CustomColor = Template.bind({});
CustomColor.args = {
  name: 'Bell',
  color: '#2563eb',
};

export const ThickStroke = Template.bind({});
ThickStroke.args = {
  name: 'Settings',
  strokeWidth: 3,
};
