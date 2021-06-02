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
import { DASHBOARDS_LIST_CONFIG } from '../../configs/DashboardsList.config';
import { Dashboard } from '@cosmotech/ui';

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

const Dashboards = ({ currentScenario }) => {
  const classes = useStyles();
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
              <Tab key={dashboard.id} label={dashboard.title} {...a11yProps(dashboard.id)} />
            ))}
          </Tabs>
        </Card>
      </Grid>
      <Grid item sm={10}>
        { currentScenario &&
        <Card className={classes.dashboard}>
            {DASHBOARDS_LIST_CONFIG.map(dashboard => (
              <TabPanel
                className={classes.dashboard}
                value={value}
                index={dashboard.id}
                key={dashboard.id}
                src={dashboard.url}
                title={dashboard.title}
                scenarioName={currentScenario.name}
                scenarioId={currentScenario.id}
              />
            ))}
        </Card>
          }
      </Grid>
    </Grid>
  );
};

Dashboards.propTypes = {
  classes: PropTypes.any,
  currentScenario: PropTypes.object
};

function TabPanel (props) {
  const { children, value, index, src, title, scenarioName, scenarioId, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Dashboard
          iframeTitle={title}
          url={src}
          scenarioName={scenarioName}
          scenarioId={scenarioId}
        />
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  scenarioName: PropTypes.string,
  scenarioId: PropTypes.string
};

export default Dashboards;
