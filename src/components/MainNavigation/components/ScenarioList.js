// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SquareAsterisk } from 'lucide-react';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getNavigationItemStyles, getListItemTextStyles } from '../styles';

const getScenarioDepth = (scenario, scenarios) => {
  if (scenario.parentId === null) return 0;
  const parent = scenarios.find((s) => s.id === scenario.parentId);
  if (!parent) return 0;
  return 1 + getScenarioDepth(parent, scenarios);
};

const buildScenarioTree = (scenarios) => {
  if (!scenarios || scenarios.length === 0) return [];

  const treeByParent = scenarios.reduce(
    (acc, scenario) => {
      const parentId = scenario.parentId ?? null;
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(scenario);
      return acc;
    },
    { null: [] }
  );

  const traverse = (parentId) => {
    const nodes = treeByParent[parentId] ?? [];
    return nodes.flatMap((node) => [node, ...traverse(node.id)]);
  };

  return traverse(null);
};

export const ScenarioList = ({ disabled, scenarios, activeScenarioId, onScenarioChange, isCollapsed }) => {
  const theme = useTheme();
  const navColors = theme.palette?.navigation ?? {};
  const scenarioTree = useMemo(() => buildScenarioTree(scenarios), [scenarios]);

  const handleScenarioClick = (scenarioId) => {
    if (onScenarioChange) {
      onScenarioChange(scenarioId);
    }
  };

  const isScenarioActive = (scenarioId) => {
    return activeScenarioId === scenarioId;
  };

  if (isCollapsed || !scenarioTree.length) {
    return null;
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        px: 2,
        minHeight: 0,
        mb: 0.5,
        '&::-webkit-scrollbar': {
          width: 8,
          border: `1px solid ${navColors.border}`,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: navColors.scrollbarThumb,
          borderRadius: '4px',
          '&:hover': {
            background: navColors.scrollbarThumbHover,
          },
        },
      }}
    >
      <List sx={{ py: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {scenarioTree.map((scenario) => {
          const depth = getScenarioDepth(scenario, scenarios);
          const isActive = isScenarioActive(scenario.id);
          const isChild = depth > 0;

          return (
            <ListItemButton
              disabled={disabled}
              variant="navigation"
              key={scenario.id}
              selected={isActive}
              onClick={() => handleScenarioClick(scenario.id)}
              sx={{
                ...getNavigationItemStyles(false),
                mb: 0.25,
                minHeight: 36,
                pl: `${1 + depth * 1}rem`,
              }}
            >
              {isChild && (
                <Box
                  component="span"
                  sx={{
                    mr: 1,
                    fontSize: 14,
                    color: 'inherit',
                    opacity: 0.7,
                    flexShrink: 0,
                  }}
                >
                  ↪
                </Box>
              )}
              {!isChild && (
                <ListItemIcon variant="navigation">
                  <SquareAsterisk size={20} />
                </ListItemIcon>
              )}
              <ListItemText
                primary={scenario.name}
                primaryTypographyProps={{
                  variant: isChild ? 'body2' : 'subtitle2',
                  color: 'inherit',
                  noWrap: true,
                }}
                sx={getListItemTextStyles(false)}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

ScenarioList.propTypes = {
  disabled: PropTypes.bool,
  scenarios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      parentId: PropTypes.string,
    })
  ).isRequired,
  activeScenarioId: PropTypes.string,
  onScenarioChange: PropTypes.func,
  isCollapsed: PropTypes.bool,
};

ScenarioList.defaultProps = {
  disabled: false,
  activeScenarioId: undefined,
  onScenarioChange: undefined,
  isCollapsed: false,
};
