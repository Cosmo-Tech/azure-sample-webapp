// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.login.main,
    height: '100%',
  },
  grid: {
    height: '100%',
  },
  errorTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
    fontSize: '16px',
    color: theme.palette.mode === 'dark' ? '#ffdad6' : '#410002',
  },
  errorPaper: {
    background: theme.palette.mode === 'dark' ? '#93000a' : '#ffdad6',
    border: theme.palette.mode === 'dark' ? 'none' : 'solid 1px #410002',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: 10,
    maxWidth: '800px',
    maxHeight: '150px',
  },
  errorText: {
    color: theme.palette.mode === 'dark' ? '#ffdad6' : '#410002',
    fontSize: '14px',
    overflow: 'auto',
    whiteSpace: 'pre-line',
    overflowWrap: 'break-word',
  },
  infoPaper: {
    background: theme.palette.mode === 'dark' ? '#52405f' : '#f2daff',
    border: theme.palette.mode === 'dark' ? 'none' : 'solid 1px #251432',
    borderRadius: '12px',
    padding: '16px',
    maxWidth: '800px',
    maxHeight: '150px',
  },
  infoText: {
    color: theme.palette.mode === 'dark' ? '#f2daff' : '#251432',
    fontSize: '14px',
    overflow: 'auto',
    whiteSpace: 'pre-line',
    overflowWrap: 'break-word',
  },
  quoteContainer: {
    [theme.breakpoints.down('xl')]: {
      display: 'none',
    },
  },
  quote: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${theme.picture.auth})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px',
    marginTop: '2%',
  },
  quoteText: {
    color: theme.palette.text.primary,
    fontWeight: 300,
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.text.primary,
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.down('xl')]: {
      justifyContent: 'center',
    },
    paddingTop: 120,
    paddingLeft: 100,
    paddingRight: 100,
    flexBasis: 700,
    [theme.breakpoints.down('xl')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  contentFooter: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.text.primary,
  },
  socialButtons: {
    marginTop: theme.spacing(3),
  },
  contact: {
    marginLeft: '10px',
    marginTop: '5px',
    color: theme.palette.text.primary,
  },
  languageSelect: {
    fontSize: '11px',
    color: theme.palette.text.primary,
  },
  copyrightText: {
    marginLeft: '8px',
    color: theme.palette.text.primary,
  },
}));

export default useStyles;
