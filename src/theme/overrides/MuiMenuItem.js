import { getNavigationPalette } from './utils';

const MuiMenuItem = {
  variants: [
    {
      props: { variant: 'navigation' },
      style: ({ theme }) => {
        const navColors = getNavigationPalette(theme);
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
};

export default MuiMenuItem;
