// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Popover, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DefaultAvatar } from '@cosmotech/ui';
import { useWorkspaceInfo } from './hooks/WorkspaceInfoHook';

const useStyles = makeStyles((theme) => ({
  workspaceDescription: {
    color: theme.palette.appbar.contrastTextSoft,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
  },
}));

export const WorkspaceInfo = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentWorkspaceData, workspacesList } = useWorkspaceInfo();

  const [isPopoverOpened, setIsPopoverOpened] = useState(false);
  const anchorElement = useRef(null);

  const navigateToWorkspaceSelector = () => {
    navigate('/workspaces');
  };

  const handlePopoverOpen = (event) => {
    setIsPopoverOpened(true);
  };

  const handlePopoverClose = () => {
    setIsPopoverOpened(false);
  };

  return currentWorkspaceData && workspacesList?.data?.length > 1 ? (
    <div>
      <Box
        data-cy="workspace-info-avatar"
        ref={anchorElement}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        aria-owns={open ? 'workspace-info-popover' : undefined}
        aria-haspopup="true"
        sx={{ mx: 1 }}
      >
        <DefaultAvatar userName={currentWorkspaceData?.name ?? ''} variant="rounded" size={32} />
      </Box>
      <Popover
        id="workspace-info-popover"
        data-cy="workspace-info-popover"
        open={isPopoverOpened}
        anchorEl={anchorElement.current}
        sx={{
          pointerEvents: 'none',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        marginThreshold={0}
        slotProps={{
          paper: {
            sx: { px: 2, pt: 1.5, pb: 1, maxWidth: 'min-content', minWidth: '200px', pointerEvents: 'auto' },
            onMouseEnter: handlePopoverOpen,
            onMouseLeave: handlePopoverClose,
          },
        }}
      >
        <Typography
          data-cy="workspace-info-name"
          variant="subtitle1"
          sx={{
            width: 'max-content',
            maxWidth: '500px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {currentWorkspaceData?.name ?? ''}
        </Typography>
        <Typography data-cy="workspace-info-description" variant="body2" className={classes.workspaceDescription}>
          {currentWorkspaceData?.description ?? ''}
        </Typography>
        <Grid container justifyContent="flex-end" mt={1.5}>
          <Button
            data-cy="switch-workspace-button"
            color="primary"
            size="small"
            onClick={() => navigateToWorkspaceSelector()}
          >
            {t('genericcomponent.workspaceselector.switch', 'Switch')}
          </Button>
        </Grid>
      </Popover>
    </div>
  ) : null;
};
