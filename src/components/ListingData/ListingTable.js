/// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ArrowUpDown } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';

const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  try {
    return format(new Date(timestamp), 'do MMM yyyy');
  } catch {
    return '-';
  }
};

export const ListingTable = ({ items, RowComponent, resolveStatus, onEdit, onCopy, onShare, onDelete, columns }) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedItems = useMemo(() => {
    if (!sortBy) return items;

    return [...items].sort((a, b) => {
      let aValue = '';
      let bValue = '';

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'created':
          aValue = new Date(a.createInfo?.timestamp || 0).getTime();
          bValue = new Date(b.createInfo?.timestamp || 0).getTime();
          break;
        case 'lastEdited':
          aValue = new Date(a.updateInfo?.timestamp || 0).getTime();
          bValue = new Date(b.updateInfo?.timestamp || 0).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortBy, sortDirection]);

  const SortableHeader = ({ column, label, width }) => (
    <TableCell
      onClick={() => handleSort(column)}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        pt: 1,
        pb: 2,
        px: 0,
        borderBottom: 'none',
        width: width || 'auto',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle1" sx={{ color: '#292F33', fontWeight: 600 }}>
          {label}
        </Typography>
        <ArrowUpDown size={16} color="#68788A" />
      </Box>
    </TableCell>
  );

  SortableHeader.propTypes = {
    column: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '4px',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 10px', px: 2 }}>
        <TableHead>
          <TableRow>
            <SortableHeader column="name" label={columns.name} width="45%" />
            <SortableHeader column="created" label={columns.created} />
            <SortableHeader column="lastEdited" label={columns.lastEdited} />
            <SortableHeader column="status" label={columns.status} />
            <TableCell sx={{ pt: 1, width: 120, borderBottom: 'none' }} />
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedItems.map((item) => (
            <RowComponent
              key={item.id}
              item={item}
              status={resolveStatus(item)}
              createdDate={formatDate(item.createInfo?.timestamp)}
              lastEditedDate={formatDate(item.updateInfo?.timestamp)}
              onEdit={onEdit}
              onCopy={onCopy}
              onShare={onShare}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ListingTable.propTypes = {
  items: PropTypes.array.isRequired,
  RowComponent: PropTypes.elementType.isRequired,
  resolveStatus: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onCopy: PropTypes.func,
  onShare: PropTypes.func,
  onDelete: PropTypes.func,
  columns: PropTypes.shape({
    name: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    lastEdited: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
