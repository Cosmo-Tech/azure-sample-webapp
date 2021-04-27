// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import { IframeScenarioResults } from '../../components';
import { useTranslation } from 'react-i18next';
import ScenarioParameters from '../../components/ScenarioParameters';

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
  mainGrid: {
    margin: `${theme.spacing(1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px`,
    flexGrow: 1,
    height: '100%'
  },
  grid: {
    flexGrow: 1,
    height: '100%'
  }
});

const Scenario = ({
  classes,
  scenarioList,
  scenarioTree,
  currentScenario
}) => {
  const { t } = useTranslation();

  return (
      <Box component='main' display='flex' flexDirection='column'
          className={classes.root}>
        <Box className={classes.scenarioPanel}>
          <Grid container spacing={2} className={classes.mainGrid}>
            <Grid item xs={9}>
              <IframeScenarioResults
              cardStyle={ { height: '100%', width: '100%' } }
              iframeTitle={t('commoncomponents.iframe.scenario.results.iframe.title', 'Supply Chain results')}
              cardTitle={t('commoncomponents.iframe.scenario.results.card.title', 'Results')}
              src="https://app.powerbi.com/reportEmbed?reportId=018525c4-3fed-49e7-9048-6d6237e80145&autoAuth=true&ctid=e9641c78-d0d6-4d09-af63-168922724e7f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWZyYW5jZS1jZW50cmFsLWEtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D"
              frameBorder="0"
              allowFullScreen
              />
            </Grid>
            <ScenarioParameters/>
          </Grid>
        </Box>
      </Box>
  );
};

Scenario.propTypes = {
  classes: PropTypes.any,
  scenarioList: PropTypes.object.isRequired,
  scenarioTree: PropTypes.object.isRequired,
  currentScenario: PropTypes.object
};

export default withStyles(useStyles)(Scenario);
