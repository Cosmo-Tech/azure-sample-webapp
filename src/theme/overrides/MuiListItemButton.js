// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
const MuiListItemButton = (theme) => ({
  variants: [
    {
      props: { variant: 'navigation' },
      style: () => {
        const navColors = theme.palette;
        return {
          borderRadius: 18,
          padding: theme.spacing(1, 1.5),
          minHeight: 40,
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeightMedium,
          color: navColors.secondary.main,
          transition: theme.transitions.create(['background-color', 'color', 'width'], {
            duration: theme.transitions.duration.short,
          }),
          '& .MuiListItemIcon-root': {
            color: 'inherit',
          },
          '&.Mui-selected': {
            backgroundColor: navColors.secondary.main,
            color: navColors.neutral.neutral04.main,
            '& .MuiListItemIcon-root': {
              color: navColors.neutral.neutral04.main,
            },
          },
          '&:hover': {
            backgroundColor: navColors.background.background02.main,
            color: navColors.secondary.main,
            '&.Mui-selected': {
              backgroundColor: navColors.secondary.main,
              color: navColors.neutral.neutral04.main,
            },
          },
        };
      },
    },
  ],
});

export default MuiListItemButton;
