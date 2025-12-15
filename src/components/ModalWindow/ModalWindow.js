// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { CircleX } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Dialog, DialogContent, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { SubNavigation } from '../Subnavigation/SubNavigation';

export const ModalWindow = ({
  open,
  onClose,
  title,
  description,
  tabs,
  selectedTabIndex,
  onTabChange,
  children,
  width,
}) => {
  const content = tabs && tabs.length > 0 ? tabs[selectedTabIndex]?.render : children;
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          width: width || '90%',
          borderRadius: '4px',
          backgroundColor: theme.palette.background.background01.main,
          overflow: 'hidden',
          position: 'relative',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Stack direction="column" sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 600,
                color: theme.palette.secondary.main,
              }}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: theme.palette.secondary.main,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>

          <IconButton onClick={onClose} sx={{ p: 0 }}>
            <CircleX size={24} color={theme.palette.secondary.main} />
          </IconButton>
        </Stack>

        {tabs && tabs.length > 0 && (
          <SubNavigation tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={onTabChange} />
        )}

        <DialogContent
          sx={{
            backgroundColor: theme.palette.neutral.neutral04.main,
            borderRadius: '4px',
            padding: '32px 16px',
          }}
        >
          {content}
        </DialogContent>
      </Stack>
    </Dialog>
  );
};

ModalWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      labelKey: PropTypes.string.isRequired,
      defaultLabel: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      render: PropTypes.node,
    })
  ),
  selectedTabIndex: PropTypes.number,
  onTabChange: PropTypes.func,
  children: PropTypes.node.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
