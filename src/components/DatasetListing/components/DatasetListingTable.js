import React from 'react';
import PropTypes from 'prop-types';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { ListingTable } from '../../ListingData';
import { DatasetTableRow } from './DatasetTableRow';

export const DatasetListingTable = ({ datasets, onEditDataset, onCopyDataset, onShareDataset, onDeleteDataset }) => {
  const getDatasetStatus = (dataset) => {
    const hasWritePermission = dataset.security?.currentUserPermissions?.includes(ACL_PERMISSIONS.DATASET.WRITE);

    if (!hasWritePermission) return 'locked';
    if (dataset.status && dataset.status !== 'READY') return 'warning';
    return 'valid';
  };

  return (
    <ListingTable
      items={datasets}
      RowComponent={({ item, ...rest }) => <DatasetTableRow dataset={item} {...rest} />}
      resolveStatus={getDatasetStatus}
      onEdit={onEditDataset}
      onCopy={onCopyDataset}
      onShare={onShareDataset}
      onDelete={onDeleteDataset}
      columns={{
        name: 'Dataset Name',
        created: 'Created',
        lastEdited: 'Last Edited',
        status: 'Status',
      }}
    />
  );
};

DatasetListingTable.propTypes = {
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      status: PropTypes.string,
      createInfo: PropTypes.shape({
        timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
      updateInfo: PropTypes.shape({
        timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
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
