// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  Tabs,
  Tab,
  makeStyles
} from '@material-ui/core';
import { SimplePowerBIReportEmbed } from '@cosmotech/ui';
import { DASHBOARDS_LIST_CONFIG } from '../../config/Dashboards';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
    width: '100%',
    height: '100%'
  },
  tabs: {
    width: '100%',
    maxWidth: '900px',
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.primary.main
    }
  },
  dashboard: {
    height: '100%'
  }
}));

const DEFAULT_MISSING_TITLE = 'MISSING_TITLE_IN_LANGUAGE';

function a11yProps (index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const Dashboards = ({ currentScenario, scenarioList, reports }) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dashboardTitle = DASHBOARDS_LIST_CONFIG[value].title[i18n.language] === undefined
    ? DEFAULT_MISSING_TITLE
    : DASHBOARDS_LIST_CONFIG[value].title[i18n.language];

  const labels = {
    noScenario: {
      title: t('commoncomponents.iframe.scenario.noscenario.title', 'No scenario yet'),
      label: t('commoncomponents.iframe.scenario.noscenario.label',
        'You can create a scenario by clicking on Create new Scenario')
    },
    noRun: {
      label: t('commoncomponents.iframe.scenario.results.label.uninitialized',
        'The scenario has not been run yet')
    },
    inProgress: {
      label: t('commoncomponents.iframe.scenario.results.label.running', 'Scenario run in progress...')
    },
    hasErrors: {
      label: t('commoncomponents.iframe.scenario.results.text.error',
        'An error occured during the scenario run')
    },
    downloadButton: t('commoncomponents.iframe.scenario.results.button.downloadLogs', 'Download logs'),
    refreshTooltip: t('commoncomponents.iframe.scenario.results.button.refresh', 'Refresh'),
    errors: {
      unknown: t('commoncomponents.iframe.scenario.error.unknown.label', 'Unknown error'),
      details: t('commoncomponents.iframe.scenario.error.unknown.details',
        'Something went wrong when fetching PowerBI reports info')
    }
  };

  return (
    <Grid container className={classes.root} direction="row">
      <Grid item sm={2}>
        {/* TODO: I don't know yet how to make a specific style for this card,
        other than using style attribute. Update this whenever knowledge has been acquired. */}
        <Card style={{ padding: '0px', height: '100%', paddingTop: '8px' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Dashboards list"
            className={classes.tabs}
          >
            {constructDashboardTabs(i18n)}
          </Tabs>
        </Card>
      </Grid>
      <Grid item sm={10}>
        <Card className={classes.dashboard}>
            {
              <TabPanel
                className={classes.dashboard}
                index={value}
                key={dashboardTitle}
                title={dashboardTitle}
                reports={reports}
                scenario={currentScenario}
                scenarioList={scenarioList.data}
                lang={i18n.language}
                labels={labels}
              />
            }
        </Card>
      </Grid>
    </Grid>
  );
};

Dashboards.propTypes = {
  classes: PropTypes.any,
  currentScenario: PropTypes.object,
  scenarioList: PropTypes.object.isRequired,
  reports: PropTypes.object.isRequired
};

function TabPanel (props) {
  const {
    children,
    index,
    title,
    reports,
    scenario,
    scenarioList,
    lang,
    labels,
    ...other
  } = props;

  return (
    <div
      role="tabpanel"
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <SimplePowerBIReportEmbed
          index={index}
          reports={reports}
          reportConfiguration={DASHBOARDS_LIST_CONFIG}
          scenario={scenario}
          scenarioList={scenarioList}
          lang={lang}
          labels={labels}/>
    </div>
  );
}

const constructDashboardTabs = (i18n) => {
  const tabs = [];
  for (const dashboardConf of DASHBOARDS_LIST_CONFIG) {
    const dashboardTitle = dashboardConf.title[i18n.language] === undefined
      ? DEFAULT_MISSING_TITLE
      : dashboardConf.title[i18n.language];
    tabs.push(<Tab key={dashboardTitle} label={dashboardTitle} {...a11yProps(dashboardConf.id)} />);
  }
  return tabs;
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  scenarioList: PropTypes.array.isRequired,
  scenario: PropTypes.object.isRequired,
  reports: PropTypes.object.isRequired,
  labels: PropTypes.object
};

export default Dashboards;
