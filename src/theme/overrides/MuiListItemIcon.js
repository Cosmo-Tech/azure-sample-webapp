import { getNavigationPalette } from './utils';

const MuiListItemIcon = {
  variants: [
    {
      props: { variant: 'navigation' },
      style: ({ theme }) => {
        const navColors = getNavigationPalette(theme);
        return {
          minWidth: 20,
          display: 'flex',
          justifyContent: 'flex-start',
          marginRight: theme.spacing(1.5),
          color: navColors.text,
        };
      },
    },
  ],
  styleOverrides: {
    root: {
      color: 'inherit',
    },
  },
};

export default MuiListItemIcon;
