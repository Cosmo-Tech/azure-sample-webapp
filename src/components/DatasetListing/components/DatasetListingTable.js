// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
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
import { ArrowUpDown, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { DatasetTableRow } from './DatasetTableRow';

const getStatusIcon = (status) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 size={16} color="#2e7d32" />;
    case 'warning':
      return <AlertTriangle size={16} color="#ed6c02" />;
    case 'locked':
      return <Lock size={16} color="#68788A" />;
    default:
      return null;
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case 'success':
      return '#E8F5E9';
    case 'warning':
      return '#FFF3E0';
    case 'locked':
      return '#F5F5F5';
    default:
      return 'transparent';
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
    return format(date, 'do MMM yyyy');
  } catch {
    return '-';
  }
};

const getDatasetStatus = (dataset) => {
  const hasWritePermission = dataset.security?.currentUserPermissions?.includes(ACL_PERMISSIONS.DATASET.WRITE);
  if (!hasWritePermission) {
    return 'locked';
  }

  if (dataset.status && dataset.status !== 'READY') {
    return 'warning';
  }
  
  return 'success';
};

export const DatasetListingTable = ({ datasets, onEditDataset, onCopyDataset, onShareDataset, onDeleteDataset }) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedDatasets = React.useMemo(() => {
    if (!sortBy) return datasets;

    return [...datasets].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'created':
          aValue = a.createInfo?.timestamp ? new Date(a.createInfo.timestamp).getTime() : 0;
          bValue = b.createInfo?.timestamp ? new Date(b.createInfo.timestamp).getTime() : 0;
          break;
        case 'lastEdited':
          aValue = a.updateInfo?.timestamp ? new Date(a.updateInfo.timestamp).getTime() : 0;
          bValue = b.updateInfo?.timestamp ? new Date(b.updateInfo.timestamp).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [datasets, sortBy, sortDirection]);

  const SortableHeader = ({ column, label }) => (
    <TableCell
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        borderBottom: '1px solid #E5E7EB',
        py: 2,
      }}
      onClick={() => handleSort(column)}
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
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '4px',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <SortableHeader column="name" label="Dataset Name" />
            <SortableHeader column="created" label="Created" />
            <SortableHeader column="lastEdited" label="Last Edited" />
            <TableCell
              sx={{
                borderBottom: '1px solid #E5E7EB',
                py: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: '#292F33', fontWeight: 600 }}>
                Status
              </Typography>
            </TableCell>
            <TableCell
              sx={{
                borderBottom: '1px solid #E5E7EB',
                py: 2,
                width: 120,
              }}
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedDatasets.map((dataset) => (
            <DatasetTableRow
              key={dataset.id}
              dataset={dataset}
              status={getDatasetStatus(dataset)}
              statusIcon={getStatusIcon(getDatasetStatus(dataset))}
              statusBgColor={getStatusBgColor(getDatasetStatus(dataset))}
              createdDate={formatDate(dataset.createInfo?.timestamp)}
              lastEditedDate={formatDate(dataset.updateInfo?.timestamp)}
              onEdit={onEditDataset}
              onCopy={onCopyDataset}
              onShare={onShareDataset}
              onDelete={onDeleteDataset}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DatasetListingTable.propTypes = {
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      createInfo: PropTypes.shape({
        timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
      updateInfo: PropTypes.shape({
        timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
      status: PropTypes.string,
      security: PropTypes.shape({
        currentUserPermissions: PropTypes.arrayOf(PropTypes.string),
      }),
    })
  ).isRequired,
  onEditDataset: PropTypes.func,
  onCopyDataset: PropTypes.func,
  onShareDataset: PropTypes.func,
  onDeleteDataset: PropTypes.func,
};

DatasetListingTable.defaultProps = {
  onEditDataset: undefined,
  onCopyDataset: undefined,
  onShareDataset: undefined,
  onDeleteDataset: undefined,
};

