// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Typography,
  AppBar,
  Link as RefLink,
  makeStyles
} from '@material-ui/core';
import { UserInfo } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  bar: {
    background: theme.palette.background.secondary,
    color: '#FFFFFF',
    display: 'inline_block'
  },
  barDiv: {
    minHeight: '48px',
    display: 'inline-flex'
  },
  logo: {
    display: 'block'
  },
  rightBar: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    marginTop: '0px',
    marginBottom: '0px',
    marginRight: `${theme.spacing(3)}px`,
    marginLeft: 'auto'
  },
  rightBarElement: {
    display: 'block',
    margin: `0 ${theme.spacing(3)}px`
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${theme.picture.auth})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px',
    marginTop: '13%'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  message: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  }
}));

const Unauthorized = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <AppBar className={classes.bar}>
        <div className={classes.barDiv}>
            <div className={classes.rightBar}>
              <RefLink
                className={classes.rightBarElement}
                component="a"
                href="https://cosmotech.com/"
                target="_blank"
              >
                <img alt="Cosmo Tech" height="28px" src="cosmotech.png" className={classes.logo}></img>
              </RefLink>
              <UserInfo className={classes.rightBarElement}/>
            </div>
        </div>
      </AppBar>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h1">
                {t('views.unauthorized.title', 'Azure Sample Web Application')}
              </Typography>
              <div className={classes.person}>
                <Typography className={classes.name} variant="body2">
                  {t('views.unauthorized.scenario.specialists.title', 'Scenario Specialists')}
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader}>
            </div>
            <div className={classes.contentBody}>
              <div className={classes.message}>
                <Typography className={classes.title} variant="h3">
                  {t('commoncomponents.text.no.permission', 'You don\'t have permission to view this page.')}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {t('commoncomponents.text.contact.get.account',
                    'Please contact the application administrator to activate your account.')}
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(Unauthorized);
