import React from 'react';
import PropTypes from 'prop-types';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { ListingTable } from '../../ListingData';
import { ScenariosTableRow } from './ScenariosTableRow';

export const ScenariosListingTable = ({
  scenarios,
  onEditScenario,
  onCopyScenario,
  onShareScenario,
  onDeleteScenario,
}) => {
  const getScenarioStatus = (scenario) => {
    const hasWritePermission = scenario.security?.currentUserPermissions?.includes(ACL_PERMISSIONS.SCENARIO.WRITE);

    if (!hasWritePermission) return 'locked';
    if (scenario.status && scenario.status !== 'READY') return 'warning';
    return 'valid';
  };

  return (
    <ListingTable
      items={scenarios}
      RowComponent={({ item, ...rest }) => <ScenariosTableRow scenario={item} scenarios={scenarios} {...rest} />}
      resolveStatus={getScenarioStatus}
      onEdit={onEditScenario}
      onCopy={onCopyScenario}
      onShare={onShareScenario}
      onDelete={onDeleteScenario}
      columns={{
        name: 'Scenario Name',
        created: 'Created',
        lastEdited: 'Last Edited',
        status: 'Status',
      }}
    />
  );
};

ScenariosListingTable.propTypes = {
  scenarios: PropTypes.arrayOf(
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

  onEditScenario: PropTypes.func,
  onCopyScenario: PropTypes.func,
  onShareScenario: PropTypes.func,
  onDeleteScenario: PropTypes.func,
};
