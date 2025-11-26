import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'Cosmotech Storybook',
    brandImage: '/theme/cosmotech_light_logo.png',
  },
});