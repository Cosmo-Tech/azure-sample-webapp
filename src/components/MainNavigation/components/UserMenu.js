// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Settings, User, CreditCard, LogOut } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const UserMenu = ({ anchorEl, open, onClose, userName, userEmail, activeUserMenuItem, onMenuAction }) => {
  const theme = useTheme();
  const navColors = theme.palette?.navigation ?? {};
  const menuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleMenuAction = (action) => {
    if (onMenuAction) {
      onMenuAction(action);
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '4px',
            border: `1px solid ${navColors.border}`,
            backgroundColor: navColors.menuBackground,
            minWidth: 200,
            mt: 1,
            p: 0,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1,
          borderBottom: `1px solid ${navColors.border}`,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: navColors.text,
            mb: 0.5,
          }}
        >
          {userName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: navColors.text,
          }}
        >
          {userEmail || 'Anonymous'}
        </Typography>
      </Box>

      <Box sx={{ py: 1 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeUserMenuItem === item.id;
          return (
            <MenuItem
              variant="navigation"
              key={item.id}
              onClick={() => handleMenuAction(item.id)}
              sx={{
                px: 2,
                py: 1.25,
                minHeight: 48,
                gap: 1.5,
                color: navColors.text,
                borderRadius: 0,
                backgroundColor: isActive ? navColors.mutedBg : navColors.menuBackground,
                '&:hover': {
                  backgroundColor: navColors.mutedBg,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 24,
                  color: navColors.icon,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <IconComponent size={16} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  color: navColors.text,
                }}
              />
            </MenuItem>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: navColors.border }} />

      <MenuItem
        variant="navigation"
        onClick={() => handleMenuAction('logout')}
        sx={{
          px: 2,
          py: 1.25,
          minHeight: 48,
          gap: 1.5,
          color: navColors.text,
          borderRadius: 0,
          '&:hover': {
            backgroundColor: navColors.mutedBg,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 24,
            color: navColors.icon,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <LogOut size={16} />
        </ListItemIcon>
        <ListItemText
          primary="Log out"
          primaryTypographyProps={{
            variant: 'subtitle2',
            color: navColors.text,
          }}
        />
      </MenuItem>
    </Menu>
  );
};

UserMenu.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string,
  activeUserMenuItem: PropTypes.string,
  onMenuAction: PropTypes.func,
};

UserMenu.defaultProps = {
  anchorEl: null,
  userEmail: undefined,
  activeUserMenuItem: undefined,
  onMenuAction: undefined,
};
