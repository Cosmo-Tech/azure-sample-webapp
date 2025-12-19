// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { HelpCircle, MoreVertical } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Avatar, IconButton, Typography, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DefaultAvatar } from '@cosmotech/ui';
import { getNavigationItemStyles, getListItemIconStyles, getListItemTextStyles } from '../styles';

export const UserProfile = ({ userName, userEmail, userProfilePic, isCollapsed, onUserMenuClick, isUserMenuOpen }) => {
  const theme = useTheme();
  const navColors = theme.palette ?? {};
  const truncatedEmail = React.useMemo(() => {
    if (!userEmail) return 'Anonymous';
    if (userEmail.length > 25) {
      return userEmail.substring(0, 22) + '...';
    }
    return userEmail;
  }, [userEmail]);

  return (
    <Box
      sx={{
        flexShrink: 0,
        p: isCollapsed ? 1 : 2,
        backgroundColor: navColors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCollapsed ? 'center' : 'stretch',
      }}
    >
      <ListItemButton
        variant="navigation"
        onClick={() => {}}
        sx={{
          ...getNavigationItemStyles(isCollapsed),
          mb: 1.5,
          minHeight: 36,
        }}
      >
        <ListItemIcon variant="navigation" sx={getListItemIconStyles(isCollapsed)}>
          <HelpCircle size={20} />
        </ListItemIcon>
        <ListItemText
          primary="Help & Documentation"
          primaryTypographyProps={{
            variant: 'subtitle2',
            color: 'inherit',
            noWrap: true,
          }}
          sx={getListItemTextStyles(isCollapsed)}
        />
      </ListItemButton>

      <Box
        sx={{
          borderTop: `1px solid ${navColors.background.background02.main}`,
          mt: 1,
          pt: 2,
          mx: isCollapsed ? -1 : -2,
          px: isCollapsed ? 1 : 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            px: isCollapsed ? 0 : 1.5,
            py: 1,
            gap: 1.5,
            flexDirection: isCollapsed ? 'column' : 'row',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flex: isCollapsed ? 0 : 1,
              minWidth: 0,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              flexDirection: isCollapsed ? 'column' : 'row',
              borderRadius: isCollapsed ? '50%' : '12px',
              padding: isCollapsed ? 0 : 1,
            }}
          >
            {userProfilePic ? (
              <Avatar
                src={userProfilePic}
                alt={userName}
                sx={{
                  width: 40,
                  height: 40,
                }}
              />
            ) : (
              <DefaultAvatar userName={userName} variant="circular" size={40} />
            )}
            {!isCollapsed && (
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                  opacity: isCollapsed ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: navColors.secondary.main,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {userName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: navColors.secondary.main,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {truncatedEmail}
                </Typography>
              </Box>
            )}
          </Box>
          {!isCollapsed && (
            <IconButton
              onClick={onUserMenuClick}
              size="small"
              aria-label="User menu options"
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen ? 'true' : undefined}
              sx={{
                color: navColors.secondary.main,
                paddingX: 1,
                borderRadius: '8px',
                backgroundColor: navColors.neutral.neutral04.main,
                '&:hover': {
                  backgroundColor: navColors.background.background02.main,
                  color: navColors.secondary.main,
                },
              }}
            >
              <MoreVertical size={20} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

UserProfile.propTypes = {
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string,
  userProfilePic: PropTypes.string,
  isCollapsed: PropTypes.bool,
  onUserMenuClick: PropTypes.func,
  isUserMenuOpen: PropTypes.bool,
};

UserProfile.defaultProps = {
  userEmail: undefined,
  userProfilePic: undefined,
  isCollapsed: false,
  onUserMenuClick: undefined,
  isUserMenuOpen: false,
};
