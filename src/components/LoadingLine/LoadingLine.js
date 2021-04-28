// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import * as dataLoading from '../../assets/loadingView/dataLoading.json';
import * as dataLoaded from '../../assets/loadingView/dataLoaded.json';
import * as dataError from '../../assets/loadingView/dataError.json';
import Lottie from 'react-lottie';
import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@material-ui/core';

const dataLoaderOptions = {
  loop: true,
  autoplay: true,
  animationData: dataLoading.default,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const dataLoadedOptions = {
  loop: false,
  autoplay: true,
  animationData: dataLoaded.default,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
const errorDataOptions = {
  loop: false,
  autoplay: true,
  animationData: dataError.default,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const LoadingLine = props => {
  const { t } = useTranslation();
  const { titleKey, isLoading, hasError, height, width } = props;
  return (
      <>
        <Grid container direction="row" alignItems={'center'}>
          <Grid item >
            <Typography variant="h2">
              {t(titleKey, 'LoadingLine Title')}
            </Typography>
          </Grid>
          <Grid item >
            {isLoading
              ? (<Lottie options={dataLoaderOptions} height={height} width={width} />)
              : (<Lottie options={hasError ? errorDataOptions : dataLoadedOptions} height={height} width={width} />)}
          </Grid>
        </Grid>
      </>
  );
};

LoadingLine.propTypes = {
  titleKey: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default LoadingLine;
