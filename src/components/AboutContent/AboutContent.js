// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Grid, makeStyles, ButtonBase, Link } from '@material-ui/core';
import theme from '../../theme';
import { useTranslation } from 'react-i18next';
import { SUPPORT_URL, COSMOTECH_URL, APP_VERSION } from '../../config/AppConfiguration';

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
  },
  picture: {
    marginRight: '16px',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '24px',
  },
  version: {
    marginTop: '16px',
    fontWeight: 'bold',
  },
  content: {
    marginTop: '2px',
    marginBottom: '16px',
  },
}));

export const AboutContent = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item className={classes.picture}>
        <ButtonBase>
          <img alt="Cosmo Tech" src={theme.picture.logo} />
        </ButtonBase>
      </Grid>
      <Grid item container xs>
        <Grid item container direction="column">
          <Grid className={classes.title} item>
            {t('genericcomponent.dialog.about.title')}
          </Grid>
          <Grid item className={classes.version}>
            {APP_VERSION}
          </Grid>
          <Grid item className={classes.content}>
            {t('genericcomponent.dialog.about.content')}
          </Grid>
          <Grid item>
            <Link href={SUPPORT_URL} target="_blank" rel="noreferrer">
              {SUPPORT_URL}
            </Link>
          </Grid>
          <Grid item>
            <Link href={COSMOTECH_URL} target="_blank" rel="noreferrer">
              {COSMOTECH_URL}
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

AboutContent.propTypes = {};
