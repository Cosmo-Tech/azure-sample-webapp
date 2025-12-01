// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const Container = styled('div')(({ theme }) => ({
  zIndex: 1,
  height: '50px',
  width: '100%',
  position: 'absolute',
  textAlign: 'center',
  padding: '5px 0',
  backgroundColor: theme.palette.error,
  color: theme.palette.error.contrastText,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledErrorContainer = ({ errorCode, errorDescription, ...rest }) => (
  <Container {...rest}>
    {errorCode && <div style={{ fontWeight: 'bold', fontSize: 'large' }}>{errorCode}</div>}
    {errorDescription && <div style={{ fontWeight: 'bold', fontSize: 'small' }}>{errorDescription}</div>}
  </Container>
);

StyledErrorContainer.propTypes = {
  errorCode: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  errorDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
};

export default StyledErrorContainer;
