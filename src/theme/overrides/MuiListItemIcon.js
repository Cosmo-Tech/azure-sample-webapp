// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
const MuiListItemIcon = (theme) => ({
  variants: [
    {
      props: { variant: 'navigation' },
      style: () => {
        const navColors = theme.palette.navigation;
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
});

export default MuiListItemIcon;
