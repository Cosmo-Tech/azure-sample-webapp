// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useHomeButton } from './hooks/HomeButtonHook';
import { FadingTooltip } from '@cosmotech/ui';

const useStyles = makeStyles((theme) => ({
  homeButton: {
    color: theme.palette.appbar.contrastText,
  },
}));
export const HomeButton = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentWorkspace, workspacesList, resetCurrentSolution } = useHomeButton();

  const navigateToWorkspaceSelector = () => {
    resetCurrentSolution();
    navigate('/workspaces');
  };

  return currentWorkspace?.data && workspacesList?.data?.length > 1 ? (
    <FadingTooltip title={t('genericcomponent.workspaceselector.homebutton', 'Workspaces')}>
      <IconButton
        data-cy="home-button"
        className={classes.homeButton}
        onClick={() => navigateToWorkspaceSelector()}
        size="large"
      >
        <HomeIcon />
      </IconButton>
    </FadingTooltip>
  ) : null;
};
