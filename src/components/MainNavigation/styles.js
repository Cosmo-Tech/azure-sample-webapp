// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getNavigationItemStyles = (isCollapsed) => {
  if (!isCollapsed) {
    return {
      width: '100%',
      pl: 2,
      minHeight: 40,
      borderRadius: 9999,
      '&.MuiButtonBase-root': {
        '&:active': {
          transform: 'none',
        },
      },
    };
  }
  return {
    px: 0,
    justifyContent: 'center',
    width: 48,
    minHeight: 40,
    borderRadius: 9999,
    '&.MuiButtonBase-root': {
      '&:active': {
        transform: 'none',
      },
    },
  };
};

export const getListItemIconStyles = (isCollapsed) => ({
  justifyContent: isCollapsed ? 'center' : 'flex-start',
  mr: isCollapsed ? 0 : 1.5,
  minWidth: 'auto',
});

export const getListItemTextStyles = (isCollapsed) => ({
  display: isCollapsed ? 'none' : 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  m: 0,
  '& .MuiTypography-root': {
    fontSize: '14px',
  },
});
