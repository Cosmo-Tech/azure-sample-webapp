// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Settings, CircleUser, CreditCard, LogOut } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const UserMenu = ({ anchorEl, open, onClose, userName, userEmail, activeUserMenuItem, onMenuAction }) => {
  const theme = useTheme();
  const navColors = theme.palette ?? {};
  const menuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: CircleUser },
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
            border: `1px solid ${navColors.background.background02.main}`,
            backgroundColor: navColors.neutral.neutral04.main,
            minWidth: 240,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 2,
          mb: 1,
          borderBottom: `1px solid ${navColors.background.background02.main}`,
          pb: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: navColors.secondary.main,
            mb: 0,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {userName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: navColors.secondary.main,
            fontSize: '12px',
          }}
        >
          {userEmail || 'Anonymous'}
        </Typography>
      </Box>

      <Box sx={{ py: 0, px: 0, mb: 1 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeUserMenuItem === item.id;
          return (
            <MenuItem
              variant="navigation"
              key={item.id}
              onClick={() => handleMenuAction(item.id)}
              sx={{
                marginLeft: 1,
                marginRight: 1,
                px: 2,
                py: 1,
                minHeight: 40,
                gap: 1.5,
                color: navColors.secondary.main,
                borderRadius: 9999,
                mb: 0.5,
                backgroundColor: isActive ? navColors.background.background02.main : 'transparent',
                '&:hover': {
                  backgroundColor: navColors.background.background02.main,
                },
                '&.MuiButtonBase-root': {
                  '&:active': {
                    transform: 'none',
                  },
                },
                '&:last-child': {
                  mb: 0,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  color: navColors.secondary.main,
                  display: 'flex',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <IconComponent size={16} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  variant: 'body2',
                  color: navColors.secondary.main,
                  fontSize: '14px',
                }}
                sx={{ m: 0 }}
              />
            </MenuItem>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: navColors.background.background02.main, my: 1 }} />

      <Box sx={{ px: 0 }}>
        <MenuItem
          variant="navigation"
          onClick={() => handleMenuAction('logout')}
          sx={{
            marginLeft: 1,
            marginRight: 1,
            px: 2,
            py: 1,
            minHeight: 40,
            gap: 1.5,
            color: navColors.secondary.main,
            borderRadius: 0,
            '&:hover': {
              backgroundColor: navColors.background.background02.main,
            },
            '&.MuiButtonBase-root': {
              '&:active': {
                transform: 'none',
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 'auto',
              color: navColors.secondary.main,
              display: 'flex',
              justifyContent: 'center',
              mr: 1.5,
            }}
          >
            <LogOut size={16} />
          </ListItemIcon>
          <ListItemText
            primary="Log out"
            primaryTypographyProps={{
              variant: 'body2',
              color: navColors.secondary.main,
              fontSize: '14px',
            }}
            sx={{ m: 0 }}
          />
        </MenuItem>
      </Box>
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
