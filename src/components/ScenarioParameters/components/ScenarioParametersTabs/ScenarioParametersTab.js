// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid2 as Grid, Stack } from '@mui/material';
import { t } from 'i18next';
import { PermissionsGate } from '@cosmotech/ui';
import { ConfigUtils } from '../../../../utils';
import ScenarioParameterInput from './ScenarioParameterInput';

const ScenarioParametersTab = ({ parametersGroupData, context, userAppRoles }) => {
  const noPermissionsPlaceHolder = (t) => {
    return (
      <div>
        {t(
          'genericcomponent.text.scenario.parameters.tabs.placeholder',
          "These parameters are confidential and you don't have permission to get access to them. If you think this " +
            'is a mistake, please contact your application administrator.'
        )}
      </div>
    );
  };

  const scenarioId = useSelector((state) => state.scenario?.current?.data?.id);
  const authorizedRoles = ConfigUtils.getParametersGroupAttribute(parametersGroupData, 'authorizedRoles');
  const isParameterVisible = (parameter) => ConfigUtils.getParameterAttribute(parameter, 'hidden') !== true;

  return (
    <PermissionsGate
      RenderNoPermissionComponent={() => noPermissionsPlaceHolder(t)}
      necessaryPermissions={authorizedRoles}
      sufficientPermissions={authorizedRoles}
      userPermissions={userAppRoles}
    >
      <Grid container key={parametersGroupData.id}>
        <Grid size={12}>
          <Stack
            spacing={2}
            direction="column"
            sx={{
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
            {parametersGroupData.parameters
              .filter((parameter) => isParameterVisible(parameter))
              .map((parameterData) => (
                <ScenarioParameterInput
                  key={`${scenarioId}_${parameterData.id}`}
                  parameterData={parameterData}
                  context={context}
                />
              ))}
          </Stack>
        </Grid>
      </Grid>
    </PermissionsGate>
  );
};

ScenarioParametersTab.propTypes = {
  parametersGroupData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  userAppRoles: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  userAppRoles: state.auth.roles,
});

export default connect(mapStateToProps)(ScenarioParametersTab);
