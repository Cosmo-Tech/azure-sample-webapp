// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Typography, makeStyles } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    padding: `0 ${theme.spacing(3)}px 0 4px`
  },
  text: {
    lineHeight: '36px'
  }
}));

const Footer = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { className, ...rest } = props;
  const year = new Date().getFullYear();

  return (
    <footer
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography variant="caption" component="div" className={classes.text}>
        <Trans i18nKey="copyrightMessage" year={year} >
          &copy; {t('views.common.footer.text.poweredby', 'Powered by CosmoTech')}:{{ year }}
        </Trans>
      </Typography>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;
