// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
const MuiListItemIcon = (theme) => ({
  variants: [
    {
      props: { variant: 'navigation' },
      style: () => {
        const navColors = theme.palette;
        return {
          minWidth: 20,
          display: 'flex',
          justifyContent: 'flex-start',
          marginRight: theme.spacing(1.5),
          color: navColors.secondary.main,
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
