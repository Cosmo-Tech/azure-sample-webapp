// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const Container = styled('div')(({ theme, isInScenarioViewContext }) => ({
  zIndex: 1,
  height: '50px',
  width: '100%',
  position: !isInScenarioViewContext ? 'absolute' : undefined,
  textAlign: 'center',
  padding: '5px 0',
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledErrorContainer = ({ errorCode, errorDescription, isInScenarioViewContext = false, ...rest }) => (
  <Container isInScenarioViewContext={isInScenarioViewContext} {...rest}>
    {errorCode && <div style={{ width: '100%', fontWeight: 'bold', fontSize: 'large' }}>{errorCode}</div>}
    {errorDescription && <div style={{ width: '100%', fontWeight: 'bold', fontSize: 'small' }}>{errorDescription}</div>}
  </Container>
);

StyledErrorContainer.propTypes = {
  errorCode: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  errorDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isInScenarioViewContext: PropTypes.bool,
  children: PropTypes.node,
};

export default StyledErrorContainer;
