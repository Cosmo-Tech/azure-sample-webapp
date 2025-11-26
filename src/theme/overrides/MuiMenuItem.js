// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const MuiMenuItem = (theme) => ({
  variants: [
    {
      props: { variant: 'navigation' },
      style: () => {
        const navColors = theme.palette.navigation;
        return {
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeightMedium,
          fontSize: 14,
          color: navColors.text,
          borderRadius: 0,
          '&:hover': {
            backgroundColor: navColors.mutedBg,
          },
        };
      },
    },
  ],
});

export default MuiMenuItem;
