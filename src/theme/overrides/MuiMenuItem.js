// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const MuiMenuItem = (theme) => ({
  variants: [
    {
      props: { variant: 'navigation' },
      style: () => {
        const navColors = theme.palette;
        return {
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeightMedium,
          fontSize: 14,
          color: navColors.secondary.main,
          borderRadius: 0,
          '&:hover': {
            backgroundColor: navColors.neutral.neutral05.main,
          },
        };
      },
    },
  ],
});

export default MuiMenuItem;
