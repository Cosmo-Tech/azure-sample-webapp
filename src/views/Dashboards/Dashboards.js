// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab
} from '@material-ui/core';
import { dashboards } from './Dashboard.config';
import { Dashboard } from '@cosmotech/ui';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper
  },
  dashboard: {
    height: '100%'
  },
  card: {
    height: '100%'
  },
  cardContent: {
    height: '100%'
  }
}));

function a11yProps (index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const Dashboards = ({ scenarioId }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container className={classes.root} direction="row">
      <Grid item sm={2}>
        <Card>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Dashboards list"
            className={classes.tabs}
          >
            {dashboards.map(dashboard => (
              <Tab key={dashboard.id} label={dashboard.title} {...a11yProps(dashboard.id)} />
            ))}
          </Tabs>
        </Card>
      </Grid>
      <Grid item sm={10}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            {dashboards.map(dashboard => (
              <TabPanel
                className={classes.dashboard}
                value={value}
                index={dashboard.id}
                key={dashboard.id}
                src={dashboard.url}
                title={dashboard.title}
                scenarioId={scenarioId}
              />
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

Dashboards.propTypes = {
  classes: PropTypes.any,
  scenarioId: PropTypes.string.isRequired
};

function TabPanel (props) {
  const { children, value, index, src, title, scenarioId, ...other } = props;

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
  scenarioId: PropTypes.string.isRequired
};

export default withStyles(useStyles)(Dashboards);
