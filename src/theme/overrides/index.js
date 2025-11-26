// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import MuiButton from './MuiButton';
import MuiListItemButton from './MuiListItemButton';
import MuiListItemIcon from './MuiListItemIcon';
import MuiMenuItem from './MuiMenuItem';

export default function createComponents(theme) {
  return {
    ...MuiButton(theme),
    ...MuiListItemButton(theme),
    ...MuiListItemIcon(theme),
    ...MuiMenuItem(theme),
  };
}
