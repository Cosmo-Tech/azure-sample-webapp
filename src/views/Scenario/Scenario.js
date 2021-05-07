// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import HierarchicalComboBox from '../../components/HierarchicalComboBox';
import { useTranslation } from 'react-i18next';
import { CreateScenarioButton } from '../../components/CreateScenarioDialog';

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  scenarioPanel: {
    height: '100%',
    flexGrow: 1,
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    margin: '4px'
  },
  scenarioList: {
    paddingLeft: '40px',
    paddingRight: '20px'
  },
  mainGrid: {
    display: 'flex',
    margin: `${theme.spacing(1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px`,
    paddingTop: '10px',
    flexGrow: 1
  },
  grid: {
    flexGrow: 1,
    height: '100%'
  }
});

const Scenario = (props) => {
  const { t } = useTranslation();

  const {
    currentScenario,
    // eslint-disable-next-line no-unused-vars
    scenarioList,
    findScenarioById,
    scenarioTree,
    datasetList,
    runTemplateList,
    userId
  } = props;

  function handleScenarioChange (event, scenario) {
    findScenarioById(scenario.id);
  }

  return (
    <Grid container alignItems="center" className={props.classes.mainGrid}>
      <Grid item xs={9}>
        <Grid container spacing={0} alignItems="center" className={props.classes.mainGrid}>
          <Grid item xs={5} className={props.classes.scenarioList}>
            <HierarchicalComboBox
               value={currentScenario.data}
              maxCharLength={36}
              tree={scenarioTree.data}
              label='views.scenario.dropdown.scenario.label'
              handleChange={handleScenarioChange}
            />
          </Grid>
          { currentScenario.data &&
              (<Grid item xs={7}>
                <Typography>{ t('views.scenario.text.scenariotype')}: { currentScenario.data.runTemplateName}</Typography>
              </Grid>)
          }
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container spacing={2} justify="flex-end" className={props.classes.mainGrid}>
          <Grid item>
            <CreateScenarioButton
                currentScenario={currentScenario}
                runTemplates={runTemplateList.data}
                datasets={datasetList.data}
                scenarios={scenarioTree.data}
                userId={userId}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

Scenario.propTypes = {
  classes: PropTypes.any,
  scenarioTree: PropTypes.object.isRequired,
  scenarioList: PropTypes.object.isRequired,
  datasetList: PropTypes.object.isRequired,
  runTemplateList: PropTypes.object.isRequired,
  currentScenario: PropTypes.object.isRequired,
  findScenarioById: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired
};

export default withStyles(useStyles)(Scenario);
