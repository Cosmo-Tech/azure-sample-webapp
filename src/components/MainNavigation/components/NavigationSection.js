// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { getNavigationItemStyles, getListItemIconStyles, getListItemTextStyles } from '../styles';

export const NavigationSection = ({
  sections,
  activeSection,
  onSectionChange,
  isCollapsed = false,
  currentWorkspaceId,
}) => {
  const navigate = useNavigate();
  const handleSectionClick = (section) => {
    if (onSectionChange) {
      onSectionChange(section);
      navigate(`/${currentWorkspaceId}/${section}`);
    }
  };

  const isSectionActive = (section) => {
    return activeSection === section;
  };

  return (
    <List
      sx={{
        px: isCollapsed ? 1 : 2,
        py: 0.5,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCollapsed ? 'center' : 'stretch',
        gap: 0.5,
      }}
    >
      {sections.map((section) => {
        const IconComponent = section.icon;
        return (
          <ListItemButton
            variant="navigation"
            key={section.id}
            selected={isSectionActive(section.id)}
            onClick={() => handleSectionClick(section.id)}
            sx={getNavigationItemStyles(isCollapsed)}
          >
            <ListItemIcon variant="navigation" sx={getListItemIconStyles(isCollapsed)}>
              <IconComponent size={20} />
            </ListItemIcon>
            <ListItemText
              primary={section.label}
              primaryTypographyProps={{
                variant: 'subtitle2',
                color: 'inherit',
                noWrap: true,
              }}
              sx={getListItemTextStyles(isCollapsed)}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

NavigationSection.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
  activeSection: PropTypes.string,
  onSectionChange: PropTypes.func,
  isCollapsed: PropTypes.bool,
  currentWorkspaceId: PropTypes.string.isRequired,
};
