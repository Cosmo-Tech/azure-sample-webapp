// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import { embedDashboard } from '@superset-ui/embedded-sdk';

export const SupersetEmbed = ({
  isLoading = false,
  guestToken,
  report,
  style = { width: '100%', height: '800px' },
  options,
}) => {
  const containerRef = useRef(null);
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    const loadSuperset = async () => {
      if (!guestToken || !report?.id || !options?.supersetUrl) return;

      try {
        setIsEmbedded(false);
        await embedDashboard({
          id: report.id,
          supersetDomain: options.supersetUrl,
          mountPoint: containerRef.current,
          fetchGuestToken: async () => guestToken,
          dashboardUiConfig: report?.uiConfig || {},
        });
        setIsEmbedded(true);
      } catch (error) {
        console.error('Superset embedding failed:', error);
      }
    };

    loadSuperset();

    if (containerRef.current && containerRef.current.children[0]) {
      containerRef.current.children[0].style.width = '100%';
      containerRef.current.children[0].style.height = '100%';
    }
  }, [guestToken, report, options]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: style?.width ?? '100%',
        height: style?.height ?? '800px',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 1,
        ...style,
      }}
    >
      <Backdrop
        open={isLoading || !isEmbedded}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" sx={{ position: 'absolute' }} />
      </Backdrop>
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          height: '100%',
          visibility: isEmbedded ? 'visible' : 'hidden',
        }}
      />
    </Box>
  );
};

SupersetEmbed.propTypes = {
  isLoading: PropTypes.bool,
  guestToken: PropTypes.string.isRequired,
  report: PropTypes.shape({
    id: PropTypes.string.isRequired,
    uiConfig: PropTypes.object,
  }).isRequired,
  style: PropTypes.object,
  options: PropTypes.shape({
    supersetUrl: PropTypes.string.isRequired,
  }).isRequired,
};
