// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card } from '@material-ui/core';
import HierarchicalComboBox from '../../components/HierarchicalComboBox';
import { IframeScenarioResults } from '../../components';
import { useTranslation } from 'react-i18next';
import { CreateScenarioButton } from '../../components/CreateScenarioDialog';
import { ScenarioParameters } from '../../components/ScenarioParameters';

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
    paddingRight: '20px'
  },
  mainGrid: {
    display: 'flex',
    flexGrow: 1,
    padding: '10px'
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
    user,
    workspace,
    solution,
    createScenario,
    classes,
    updateAndLaunchScenario
  } = props;

  const workspaceId = workspace.data.id;
  const [editMode, setEditMode] = useState(false);

  function handleScenarioChange (event, scenario) {
    findScenarioById(workspaceId, scenario.id);
  }

  return (
    <Grid container direction="column" className={classes.mainGrid}>
      <Grid item xs={12}>
        <Grid container alignItems="center" className={classes.mainGrid}>
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
                  solution={solution}
                  workspaceId={workspaceId}
                  createScenario={createScenario}
                  currentScenario={currentScenario}
                  runTemplates={runTemplateList.data}
                  datasets={datasetList.data}
                  scenarios={scenarioTree.data}
                  user={user}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {/* <Dashboard
          iframeTitle="Dashboard"
          url="https://app.powerbi.com/reportEmbed?reportId=018525c4-3fed-49e7-9048-6d6237e80145&autoAuth=true&ctid=e9641c78-d0d6-4d09-af63-168922724e7f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWZyYW5jZS1jZW50cmFsLWEtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D"
        /> */}
        <Card style={{ height: '400px' }}>
          <IframeScenarioResults
            cardStyle={ { height: '100%', width: '100%' } }
            iframeTitle={t('commoncomponents.iframe.scenario.results.iframe.title', 'Supply Chain results')}
            cardTitle={t('commoncomponents.iframe.scenario.results.card.title', 'Results')}
            src="https://app.powerbi.com/reportEmbed?reportId=018525c4-3fed-49e7-9048-6d6237e80145&autoAuth=true&ctid=e9641c78-d0d6-4d09-af63-168922724e7f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWZyYW5jZS1jZW50cmFsLWEtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D"
            frameBorder="0"
            allowFullScreen
          />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <ScenarioParameters
            editMode={editMode}
            changeEditMode={setEditMode}
            updateAndLaunchScenario={updateAndLaunchScenario}
            workspaceId={workspaceId}
            scenarioId={currentScenario.data.id}/>
        </Card>
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
  user: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  solution: PropTypes.object.isRequired,
  createScenario: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired
};

export default withStyles(useStyles)(Scenario);
