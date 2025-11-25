import { getNavigationPalette } from './utils';

const MuiListItemButton = {
  variants: [
    {
      props: { variant: 'navigation' },
      style: ({ theme }) => {
        const navColors = getNavigationPalette(theme);
        return {
          borderRadius: 18,
          padding: theme.spacing(1, 1.5),
          minHeight: 40,
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeightMedium,
          color: navColors.text,
          transition: theme.transitions.create(['background-color', 'color', 'width'], {
            duration: theme.transitions.duration.short,
          }),
          '& .MuiListItemIcon-root': {
            color: 'inherit',
          },
          '&.Mui-selected': {
            backgroundColor: navColors.activeBg,
            color: navColors.activeText,
            '& .MuiListItemIcon-root': {
              color: navColors.activeText,
            },
          },
          '&:hover': {
            backgroundColor: navColors.hoverBg,
            color: navColors.text,
            '&.Mui-selected': {
              backgroundColor: navColors.activeBg,
              color: navColors.activeText,
            },
          },
        };
      },
    },
  ],
};

export default MuiListItemButton;
