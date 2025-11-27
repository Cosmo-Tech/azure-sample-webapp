// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SquarePen, Share2, Trash2, InfoIcon, CopyPlus } from 'lucide-react';
import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Box, IconButton, Tooltip, Typography } from '@mui/material';
import StatusBar from '../../StatusBar';

export const DatasetTableRow = ({
  dataset,
  status,
  createdDate,
  lastEditedDate,
  onEdit,
  onCopy,
  onShare,
  onDelete,
}) => {
  const handleAction = (action, e) => {
    e.stopPropagation();
    if (action === 'edit' && onEdit) onEdit(dataset);
    if (action === 'copy' && onCopy) onCopy(dataset);
    if (action === 'share' && onShare) onShare(dataset);
    if (action === 'delete' && onDelete) onDelete(dataset);
  };

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
        sx={{ py: 1, borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', backgroundClip: 'padding-box', pl: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ color: (theme) => theme.palette.secondary.main }}>
            {dataset.name}
          </Typography>
          <Tooltip
            title={'tooltip'}
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
      <TableCell sx={{ py: 1, pl: 0 }}>
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.neutral.neutral02.main }}>
          {createdDate}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1, pl: 0 }}>
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.neutral.neutral02.main }}>
          {lastEditedDate}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1, pl: 0 }}>
        <StatusBar status={status} size="small" />
      </TableCell>
      <TableCell
        sx={{
          py: 1,
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          backgroundClip: 'padding-box',
          pl: 0,
          pr: 1,
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

DatasetTableRow.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
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
