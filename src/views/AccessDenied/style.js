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
  quoteContainer: {
    [theme.breakpoints.down('xl')]: {
      display: 'none',
    },
  },
  quote: {
    backgroundColor: theme.palette.login.main,
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
  errorText: {
    color: theme.palette.error.contrastText,
    fontSize: '14px',
    fontWeight: 'bold',
    maxWidth: '650px',
    maxHeight: '300px',
    overflow: 'auto',
    paddingRight: 7,
    paddingLeft: 7,
    whiteSpace: 'pre-line',
    overflowWrap: 'break-word',
  },
  errorPaper: {
    background: theme.palette.error.main,
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 6,
    paddingRight: 6,
    marginBottom: 10,
    width: 'fit-content',
  },
  timeout: {
    marginBottom: 8,
    marginLeft: 8,
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentBody: {
    paddingLeft: '100px',
    paddingRight: '100px',
    paddingTop: '200px',
  },
  title: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    fontWeight: 'bold',
    fontSize: '32px',
    color: theme.palette.text.primary,
  },
  formControl: {
    fontSize: '11px',
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
