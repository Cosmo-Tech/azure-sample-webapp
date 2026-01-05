// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SquarePen, Share2, Trash2, SquareAsterisk, CornerDownRightIcon, CopyPlus, InfoIcon } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Box, IconButton, Tooltip, Typography } from '@mui/material';
import StatusBar from '../../StatusBar';

export const ScenariosTableRow = ({
  scenario,
  status,
  createdDate,
  lastEditedDate,
  onEdit,
  onCopy,
  onShare,
  onDelete,
  scenarios,
}) => {
  const getScenarioDepth = (scenario, scenarios) => {
    if (scenario.parentId === null) return 0;
    const parent = scenarios.find((s) => s.id === scenario.parentId);
    if (!parent) return 0;
    return 1 + getScenarioDepth(parent, scenarios);
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    if (action === 'edit' && onEdit) onEdit(scenario);
    if (action === 'copy' && onCopy) onCopy(scenario);
    if (action === 'share' && onShare) onShare(scenario);
    if (action === 'delete' && onDelete) onDelete(scenario);
  };
  const depth = getScenarioDepth(scenario, scenarios);
  const isChild = depth > 0;
  const isLocked = status === 'locked';

  return (
    <TableRow
      sx={{
        backgroundColor: (theme) => theme.palette.background.background01.main,
        gap: '8px',
        '&:hover': {
          backgroundColor: '#F9FAFB',
        },
        '&:last-child td': {
          borderBottom: 0,
        },
      }}
    >
      <TableCell
        sx={{
          py: 1,
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px',
          backgroundClip: 'padding-box',
          pl: 1,
          border: 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isChild && (
            <Box
              component="span"
              sx={{
                ml: `${depth * 8}px`,
                fontSize: 14,
                color: 'inherit',
                opacity: 0.7,
                flexShrink: 0,
              }}
            >
              <CornerDownRightIcon size={16} />
            </Box>
          )}
          {!isChild && <SquareAsterisk size={16} />}
          <Typography variant="subtitle1" sx={{ color: (theme) => theme.palette.secondary.main }}>
            {scenario.name}
          </Typography>
          <Tooltip
            title={scenario.name}
            placement="bottom"
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: (theme) => theme.palette.neutral.neutral04.main,
                  color: (theme) => theme.palette.secondary.main,
                },
              },
            }}
          >
            <InfoIcon size={16} sx={{ color: (theme) => theme.palette.secondary.main }} />
          </Tooltip>
        </Box>
      </TableCell>
      <TableCell sx={{ py: 1, pl: 0, border: 'none' }}>
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.secondary.main }}>
          {createdDate}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1, pl: 0, border: 'none' }}>
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.secondary.main }}>
          {lastEditedDate}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1, pl: 0, border: 'none' }}>
        <StatusBar status={status} size="small" tooltip={status} />
      </TableCell>
      <TableCell
        sx={{
          py: 1,
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          backgroundClip: 'padding-box',
          pl: 0,
          pr: 1,
          border: 'none',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          {!isLocked && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={(e) => handleAction('edit', e)}
                  sx={{
                    color: (theme) => theme.palette.neutral.neutral02.main,
                    p: 1.5,
                    borderRadius: '4px',
                    backgroundColor: (theme) => theme.palette.neutral.neutral04.main,
                  }}
                >
                  <SquarePen size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy">
                <IconButton
                  size="small"
                  onClick={(e) => handleAction('copy', e)}
                  sx={{
                    color: (theme) => theme.palette.neutral.neutral02.main,
                    p: 1.5,
                    borderRadius: '4px',
                    backgroundColor: (theme) => theme.palette.neutral.neutral04.main,
                  }}
                >
                  <CopyPlus size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton
                  size="small"
                  onClick={(e) => handleAction('share', e)}
                  sx={{
                    color: (theme) => theme.palette.neutral.neutral02.main,
                    p: 1.5,
                    borderRadius: '4px',
                    backgroundColor: (theme) => theme.palette.neutral.neutral04.main,
                  }}
                >
                  <Share2 size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={(e) => handleAction('delete', e)}
                  sx={{
                    color: (theme) => theme.palette.status.error.main,
                    p: 1.5,
                    borderRadius: '4px',
                    backgroundColor: (theme) => theme.palette.status.error.background,
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

ScenariosTableRow.propTypes = {
  scenario: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    parentId: PropTypes.string,
  }).isRequired,
  scenarios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      parentId: PropTypes.string,
    })
  ).isRequired,
  status: PropTypes.oneOf(['success', 'warning', 'locked']),
  statusIcon: PropTypes.node,
  statusBgColor: PropTypes.string,
  createdDate: PropTypes.string.isRequired,
  lastEditedDate: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onCopy: PropTypes.func,
  onShare: PropTypes.func,
  onDelete: PropTypes.func,
};
