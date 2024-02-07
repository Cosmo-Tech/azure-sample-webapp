// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Tab, Tabs } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDashboardsViewReportsConfig } from '../../state/hooks/PowerBIHooks';
import { DashboardsPowerBiReport } from './components';

const useStyles = makeStyles((theme) => ({
  dashboardsRoot: {
    height: '100%',
    margin: 'auto',
    width: '100%',
  },
  tabs: {
    width: '100%',
    maxWidth: '900px',
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.primary.main,
    },
    '& .MuiButtonBase-root': {
      maxWidth: '900px',
    },
    '& .MuiTab-root': {
      textAlign: 'right',
      alignItems: 'flex-end',
    },
  },
  dashboardsTabsContainer: {
    height: '100%',
  },
  dashboardsTabPanel: {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  dashboardsMainContainer: {
    height: '100%',
  },
  dashboardsMainCard: {
    height: '100%',
  },
  dashboardsMainCardContent: {
    height: '100%',
    overflow: 'auto',
  },
  dashboardsTabCard: {
    height: '100%',
  },
}));

const DEFAULT_MISSING_TITLE = 'MISSING_TITLE_IN_LANGUAGE';

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Dashboards = () => {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dashboardsViewReportsConfig = useDashboardsViewReportsConfig();
  const dashboardTitle = dashboardsViewReportsConfig?.[value]?.title?.[i18n.language] ?? DEFAULT_MISSING_TITLE;

  return (
    <Grid container className={classes.dashboardsRoot} direction="row">
      <Grid item sm={2} className={classes.dashboardsTabsContainer}>
        <Card className={classes.dashboardsTabCard}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Dashboards list"
            className={classes.tabs}
            indicatorColor="primary"
            textColor="inherit"
          >
            {constructDashboardTabs(i18n, dashboardsViewReportsConfig)}
          </Tabs>
        </Card>
      </Grid>
      <Grid item sm={10} className={classes.dashboardsMainContainer}>
        <Card className={classes.dashboardsMainCard}>
          <CardContent className={classes.dashboardsMainCardContent}>
            <TabPanel
              className={classes.dashboardsTabPanel}
              index={value}
              key={dashboardTitle}
              title={dashboardTitle}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

function TabPanel(props) {
  const { children, index, title, ...other } = props;

  return (
    <div role="tabpanel" id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      <DashboardsPowerBiReport index={index} />
    </div>
  );
}

const constructDashboardTabs = (i18n, dashboardsViewReportsConfig) => {
  const tabs = [];
  for (const dashboardConf of dashboardsViewReportsConfig) {
    const dashboardTitle = dashboardConf.title[i18n.language] ?? DEFAULT_MISSING_TITLE;
    tabs.push(<Tab key={dashboardTitle} label={dashboardTitle} {...a11yProps(dashboardConf.id)} />);
  }
  return tabs;
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
};

export default Dashboards;
