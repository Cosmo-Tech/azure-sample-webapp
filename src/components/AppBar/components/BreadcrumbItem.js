import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Link as MuiLink } from '@mui/material';

export const BreadcrumbItem = ({ href, children, maxWidth = '100%' }) => {
  return (
    <MuiLink underline="hover" color="inherit" href={href} sx={{ display: 'inline-block', maxWidth }}>
      <Typography
        fontSize={14}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}
        title={children}
      >
        {children}
      </Typography>
    </MuiLink>
  );
};

BreadcrumbItem.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
