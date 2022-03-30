// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    height: '100%',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  scenarioPanel: {
    height: '100%',
    flexGrow: 1,
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    margin: '4px',
  },
  scenarioList: {
    paddingRight: '20px',
  },
  mainGrid: {
    display: 'flex',
    flexGrow: 1,
    paddingLeft: '2px',
    paddingTop: '6px',
    paddingRight: '2px',
    paddingBottom: '6px',
    backgroundColor: theme.palette.background.paper,
  },
  grid: {
    flexGrow: 1,
    height: '100%',
  },
  powerBICard: {
    height: '400px',
  },
}));

export default useStyles;
