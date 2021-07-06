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
import { DASHBOARDS_LIST_CONFIG } from '../../configs/App.config';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper
  },
  dashboard: {
    height: '100%'
  }
}));

function a11yProps (index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const Dashboards = ({ currentScenario, scenarioList, reports }) => {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
            {DASHBOARDS_LIST_CONFIG.map(dashboard => (
              <Tab key={dashboard.title} label={dashboard.title} {...a11yProps(dashboard.id)} />
            ))}
          </Tabs>
        </Card>
      </Grid>
      <Grid item sm={10}>
        <Card className={classes.dashboard}>
            {
              <TabPanel
                className={classes.dashboard}
                index={value}
                key={DASHBOARDS_LIST_CONFIG[value].id}
                title={DASHBOARDS_LIST_CONFIG[value].title}
                reports={reports}
                scenario={currentScenario}
                scenarioList={scenarioList.data}
                lang={i18n.language}
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
          lang={lang} />
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  scenarioList: PropTypes.array.isRequired,
  scenario: PropTypes.object.isRequired,
  reports: PropTypes.object.isRequired
};

export default Dashboards;
