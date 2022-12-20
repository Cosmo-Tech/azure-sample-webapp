// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import { IconButton, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useHomeButton } from './hooks/HomeButtonHook';
import { FadingTooltip } from '@cosmotech/ui';
import { useResetCurrentWorkspace } from '../../../state/hooks/WorkspaceHooks';

const useStyles = makeStyles((theme) => ({
  homeButton: {
    color: theme.palette.appbar.contrastText,
  },
}));
export const HomeButton = () => {
  const resetWorkspace = useResetCurrentWorkspace();
  const navigateToWorkspaceSelector = () => {
    resetWorkspace();
    navigate('/workspaces');
  };
  const classes = useStyles();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentWorkspace, workspacesList } = useHomeButton();
  return currentWorkspace?.data && workspacesList?.data?.length > 1 ? (
    <FadingTooltip title={t('genericcomponent.workspaceselector.homebutton', 'Workspaces')}>
      <IconButton data-cy="home-button" className={classes.homeButton} onClick={() => navigateToWorkspaceSelector()}>
        <HomeIcon />
      </IconButton>
    </FadingTooltip>
  ) : null;
};
