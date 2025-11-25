// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getNavigationItemStyles = (isCollapsed) => {
  if (!isCollapsed) {
    return { width: '100%' };
  }
  return {
    px: 0,
    justifyContent: 'center',
    width: 48,
  };
};

export const getListItemIconStyles = (isCollapsed) => ({
  justifyContent: isCollapsed ? 'center' : 'flex-start',
  mr: isCollapsed ? 0 : 1.5,
});

export const getListItemTextStyles = (isCollapsed) => ({
  display: isCollapsed ? 'none' : 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  m: 0,
});
