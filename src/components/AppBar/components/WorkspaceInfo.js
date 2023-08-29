// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { DefaultAvatar } from '@cosmotech/ui';
import { Button, Grid, IconButton, Popover, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceInfo } from './hooks/WorkspaceInfoHook';
import { useTranslation } from 'react-i18next';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const navigateToWorkspaceSelector = () => {
    navigate('/workspaces');
  };
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return currentWorkspaceData && workspacesList?.data?.length > 1 ? (
    <div>
      <IconButton
        data-cy="workspace-info-avatar"
        onMouseEnter={handlePopoverOpen}
        aria-owns={open ? 'workspace-info-popover' : undefined}
        aria-haspopup="true"
      >
        <DefaultAvatar userName={currentWorkspaceData?.name ?? ''} variant="rounded" size={32} />
      </IconButton>
      <Popover
        id="workspace-info-popover"
        data-cy="workspace-info-popover"
        open={open}
        anchorEl={anchorEl}
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
          paper: { sx: { px: 2, pt: 1.5, pb: 1, maxWidth: 'min-content', minWidth: '200px' } },
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
