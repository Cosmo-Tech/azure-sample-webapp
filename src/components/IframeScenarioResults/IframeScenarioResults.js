// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CardContent, CardMedia } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = theme => ({
  iframe: {
    display: 'block',
    height: '100%'
  },
  placeholder: {
    backgroundColor: theme.palette.background.secondary,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px'
  },
  label: {
    height: '14px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0',
    lineHeight: '14px'
  }
});

const IframeScenarioResults = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [enable, setEnable] = useState(true);

  const { t } = useTranslation();

  const { classes, iframeTitle, cardTitle, cardStyle, ...otherProps } = props;

  return (
        <div>
          <Typography variant='subtitle1' component='h2'>
            {cardTitle}
          </Typography>
          <CardContent className={classes.cardContent}>
            { enable &&
              <CardMedia
                className={classes.iframe}
                title={iframeTitle}
                component="iframe"
                src={otherProps.src} {...otherProps}/>
            }
            { !enable &&
              <Typography
                variant="caption"
                component="p"
                color="textSecondary"
                className={classes.label}
              >{t('commoncomponents.iframe.scenario.results.text.no.result', 'No results for this scenario.')}</Typography>
            }
          </CardContent>
        </div>
  );
};

IframeScenarioResults.propTypes = {
  classes: PropTypes.any,
  iframeTitle: PropTypes.string.isRequired,
  cardTitle: PropTypes.string.isRequired,
  cardStyle: PropTypes.any,
  src: PropTypes.string.isRequired
};

export default withStyles(useStyles)(IframeScenarioResults);
