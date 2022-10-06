// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import { Fade, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useWorkspace, useWorkspacesList } from '../../../state/hooks/WorkspaceHooks';

const useStyles = makeStyles((theme) => ({
  homeButton: {
    color: theme.palette.appbar.contrastText,
  },
}));
export const HomeButton = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentWorkspace = useWorkspace();
  const workspacesList = useWorkspacesList();
  return currentWorkspace && workspacesList?.length > 1 ? (
    <Tooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      title={t('genericcomponent.workspaceselector', 'Workspaces')}
    >
      <IconButton className={classes.homeButton} onClick={() => navigate('/workspaces')}>
        <HomeIcon />
      </IconButton>
    </Tooltip>
  ) : null;
};
