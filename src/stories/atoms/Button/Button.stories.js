/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Star } from 'lucide-react';
import Button from '@mui/material/Button';
import { fn } from 'storybook/test';
import Icons from '../../utils/Icons';

const iconMapping = Icons.reduce((acc, item) => {
  acc[item.name] = item.Icon;
  return acc;
}, {});

export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'highlighted', 'copilot', 'outlined', 'filter', 'inpage'],
    },
    state: {
      control: 'select',
      options: ['enabled', 'disabled', 'active'],
    },
    icon: {
      control: 'select',
      options: Object.keys(iconMapping),
      mapping: iconMapping,
    },
  },
  args: { onClick: fn() },
};

const Template = ({ label, variant, state, icon: Icon, onClick }) => (
  <div
    style={{
      backgroundColor: '#F4F6F8',
      height: '100vh',
      width: '800px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Button variant={variant} state={state} iconOnly={!label} startIcon={Icon ? <Icon /> : null} onClick={onClick}>
      {label}
    </Button>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  label: 'Button Text',
  variant: 'default',
  state: 'enabled',
  icon: Star,
};
Default.parameters = {
  docs: {
    source: {
      code: `<Button variant="default" cosmoState="enabled" startIcon={<Star />}>Button Text</Button>`,
    },
  },
};

export const Highlighted = Template.bind({});
Highlighted.args = {
  label: 'Button Text',
  variant: 'highlighted',
  state: 'enabled',
  icon: Star,
};
Highlighted.parameters = {
  docs: {
    source: {
      code: `<Button variant="highlighted" cosmoState="enabled" startIcon={<Star />}>Button Text</Button>`,
    },
  },
};

export const Copilot = Template.bind({});
Copilot.args = {
  label: 'Button Text',
  variant: 'copilot',
  state: 'enabled',
  icon: Star,
};
Copilot.parameters = {
  docs: {
    source: {
      code: `<Button variant="copilot" cosmoState="enabled" startIcon={<Star />}>Button Text</Button>`,
    },
  },
};

export const OutlinedActive = Template.bind({});
OutlinedActive.args = {
  label: '',
  variant: 'outlined',
  state: 'active',
  icon: Star,
};
OutlinedActive.parameters = {
  docs: {
    source: {
      code: `<Button variant="outlined" cosmoState="active" iconOnly startIcon={<Star />} />`,
    },
  },
};

export const FilterEnabled = Template.bind({});
FilterEnabled.args = {
  label: '',
  variant: 'filter',
  state: 'enabled',
  icon: Star,
};
FilterEnabled.parameters = {
  docs: {
    source: {
      code: `<Button variant="filter" cosmoState="enabled" iconOnly startIcon={<Star />} />`,
    },
  },
};

export const InpageEnabled = Template.bind({});
InpageEnabled.args = {
  label: '',
  variant: 'inpage',
  state: 'enabled',
  icon: Star,
};
InpageEnabled.parameters = {
  docs: {
    source: {
      code: `<Button variant="inpage" cosmoState="enabled" iconOnly startIcon={<Star />} />`,
    },
  },
};

export const DefaultIconOnly = Template.bind({});
DefaultIconOnly.args = {
  label: '',
  variant: 'default',
  state: 'enabled',
  icon: Star,
};
DefaultIconOnly.parameters = {
  docs: {
    source: {
      code: `<Button variant="default" cosmoState="enabled" iconOnly startIcon={<Star />} />`,
    },
  },
};
