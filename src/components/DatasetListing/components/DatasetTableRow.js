// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Box, IconButton, Tooltip, Typography } from '@mui/material';
import { SquarePen, Copy, Share2, Trash2, Info } from 'lucide-react';

export const DatasetTableRow = ({
  dataset,
  status,
  statusIcon,
  statusBgColor,
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
        '&:hover': {
          backgroundColor: '#F9FAFB',
        },
        '&:last-child td': {
          borderBottom: 0,
        },
      }}
    >
      <TableCell sx={{ py: 2 }}>
        <Typography variant="body1" sx={{ color: '#292F33', fontWeight: 400 }}>
          {dataset.name}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 2 }}>
        <Typography variant="body2" sx={{ color: '#68788A' }}>
          {createdDate}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 2 }}>
        <Typography variant="body2" sx={{ color: '#68788A' }}>
          {lastEditedDate}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 2 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: '4px',
            backgroundColor: statusBgColor,
          }}
        >
          {statusIcon}
          <Tooltip title="Status information">
            <Info size={14} color="#68788A" style={{ cursor: 'help' }} />
          </Tooltip>
        </Box>
      </TableCell>
      <TableCell sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          {!isLocked && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={(e) => handleAction('edit', e)}
                  sx={{
                    color: '#68788A',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                    },
                  }}
                >
                  <SquarePen size={16} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton
                  size="small"
                  onClick={(e) => handleAction('share', e)}
                  sx={{
                    color: '#68788A',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                    },
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
                    color: '#EF4444',
                    '&:hover': {
                      backgroundColor: '#FEE2E2',
                    },
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Copy">
            <IconButton
              size="small"
              onClick={(e) => handleAction('copy', e)}
              sx={{
                color: '#68788A',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }}
            >
              <Copy size={16} />
            </IconButton>
          </Tooltip>
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

DatasetTableRow.defaultProps = {
  status: 'success',
  statusIcon: null,
  statusBgColor: 'transparent',
  onEdit: undefined,
  onCopy: undefined,
  onShare: undefined,
  onDelete: undefined,
};

