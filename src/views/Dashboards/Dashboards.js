// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Tab, Tabs } from '@mui/material';
import { useRedirectFromDisabledView } from '../../hooks/RouterHooks';
import { useDashboardsViewReportsConfig } from '../../state/powerBi/hooks';
import { DashboardsPowerBiReport } from './components';

const DEFAULT_MISSING_TITLE = 'MISSING_TITLE_IN_LANGUAGE';

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Dashboards = () => {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dashboardsViewReportsConfig = useDashboardsViewReportsConfig();
  useRedirectFromDisabledView('dashboards');
  const dashboardTitle = dashboardsViewReportsConfig?.[value]?.title?.[i18n.language] ?? DEFAULT_MISSING_TITLE;

  return (
    <Grid container sx={{ height: '100%', margin: 'auto', width: '100%' }} direction="row">
      <Grid sx={{ height: '100%' }} size={{ sm: 2 }}>
        <Card sx={{ height: '100%' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Dashboards list"
            sx={{
              width: '100%',
              maxWidth: '900px',
              '& .MuiTabs-indicator': {
                backgroundColor: (theme) => theme.palette.primary.main,
              },
              '& .MuiButtonBase-root': {
                maxWidth: '900px',
              },
              '& .MuiTab-root': {
                textAlign: 'right',
                alignItems: 'flex-end',
              },
            }}
            indicatorColor="primary"
            textColor="inherit"
          >
            {constructDashboardTabs(i18n, dashboardsViewReportsConfig)}
          </Tabs>
        </Card>
      </Grid>
      <Grid sx={{ height: '100%' }} size={{ sm: 10 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%', overflow: 'auto' }}>
            <TabPanel
              sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
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
