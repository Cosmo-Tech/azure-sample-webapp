// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  mainGrid: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '2px',
    paddingTop: '6px',
    paddingRight: '2px',
    paddingBottom: '6px',
  },
  scenarioSelectGridItem: {
    paddingLeft: '5px',
    paddingTop: '12px',
    paddingBottom: '15px',
    width: '400px',
  },
  cytoscapeGridItem: {
    flexGrow: 1,
  },
}));

export default useStyles;
