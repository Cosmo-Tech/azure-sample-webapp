// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ArrowLeftToLine, Settings, TriangleAlert } from 'lucide-react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { KPIBox } from './components/KpiBox';

export const KPIGroup = ({ items, showControls = true, status = '', background, border }) => {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  return (
    <Stack direction="column" gap={1} sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        {!collapsed && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              width: '100%',
              overflow: 'hidden',
              transition: 'height 0.25s ease, opacity 0.25s ease',
              height: collapsed ? 0 : 'auto',
              opacity: collapsed ? 0 : 1,
            }}
          >
            {items.map((item, i) => (
              <KPIBox
                key={i}
                title={item.title}
                value={item.value}
                comparison={item.comparison}
                comparisonColor={item.comparisonColor}
                scenarioName={item.scenarioName}
                currency={item.currency}
                currencyPosition={item.currencyPosition}
                background={background}
                border={border}
              />
            ))}
          </Box>
        )}

        {showControls && (
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              backgroundColor: background,
              borderRadius: '4px',
              padding: 1,
              border: border ? (theme) => `1px solid ${theme.palette.background.background02.main}` : 'none',
              minHeight: '85px',
            }}
          >
            <ArrowLeftToLine
              size={18}
              onClick={toggleCollapsed}
              style={{
                cursor: 'pointer',
                color: theme.palette.neutral.neutral03.main,
                transform: collapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />

            <Settings size={18} style={{ color: theme.palette.secondary.main }} />
          </Stack>
        )}
      </Box>

      {status && (
        <Stack direction="row" alignItems="center" gap={1}>
          <TriangleAlert size={18} style={{ color: theme.palette.neutral.neutral03.main }} />
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.neutral.neutral03.main,
              fontSize: 12,
            }}
          >
            {status}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

KPIGroup.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      comparison: PropTypes.string,
      comparisonColor: PropTypes.oneOf(['positive', 'negative', 'neutral']),
      scenarioName: PropTypes.string,
      currency: PropTypes.string,
      currencyPosition: PropTypes.oneOf(['before', 'after']),
    })
  ).isRequired,
  showControls: PropTypes.bool,
  status: PropTypes.string,
  background: PropTypes.string,
  border: PropTypes.bool,
};
