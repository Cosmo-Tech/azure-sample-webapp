// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { TranslationUtils } from '../../../../utils';
import PropTypes from 'prop-types';
import { Layout, Model } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';

const useStyles = makeStyles((theme) => ({
  tabPanel: {
    maxHeight: 450,
    overflow: 'auto',
  },
  placeholder: {
    margin: `0 ${theme.spacing(3)}`,
  },
}));
const DEFAULT_VIEW_CONFIG = {
  global: {
    enableEdgeDock: false,
    tabEnableClose: false,
    tabEnableRename: false,
    tabEnableFloat: false,
    tabSetMinWidth: 100,
    tabSetMinHeight: 80,
    borderMinSize: 100,
    tabEnableRenderOnDemand: false,
    rootOrientationVertical: true,
  },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 50,
        children: [],
      },
    ],
  },
};

function getViewModel(tabs, t) {
  const layoutChildren = [];
  for (const groupMetadata of tabs) {
    layoutChildren.push({
      type: 'tab',
      name: t(TranslationUtils.getParametersGroupTranslationKey(groupMetadata.id), groupMetadata.id),
      component: groupMetadata.id,
    });
  }
  DEFAULT_VIEW_CONFIG.layout.children[0].children = layoutChildren;
  return Model.fromJson(DEFAULT_VIEW_CONFIG);
}

const ScenarioParametersTabs = ({ parametersGroupsMetadata, userRoles }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const viewModel = useMemo(() => getViewModel(parametersGroupsMetadata, t), [t, parametersGroupsMetadata]);

  const viewFactory = (node) => {
    const component = node.getComponent();
    return parametersGroupsMetadata.find((group) => group.id === component).tab;
  };

  return (
    <div data-cy="scenario-parameters-tabs">
      {parametersGroupsMetadata.length === 0 ? (
        <div className={classes.placeholder} data-cy="no-parameters-placeholder">
          {t('genericcomponent.text.scenario.parameters.placeholder', 'No parameters to edit.')}
        </div>
      ) : (
        <Layout model={viewModel} factory={viewFactory} />
      )}
    </div>
  );
};

ScenarioParametersTabs.propTypes = {
  parametersGroupsMetadata: PropTypes.array.isRequired,
  userRoles: PropTypes.array.isRequired,
};

export default ScenarioParametersTabs;
