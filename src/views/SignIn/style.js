// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.signInPage,
    height: '100%',
  },
  grid: {
    height: '100%',
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  quote: {
    backgroundColor: theme.palette.background.signInPage,
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
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
  },
  form: {
    paddingTop: 120,
    paddingLeft: 100,
    paddingRight: 100,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
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
