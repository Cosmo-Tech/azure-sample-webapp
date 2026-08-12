// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Menu } from '@mui/material';
import { EditScenarioButton, ShareScenarioButton } from '../../../components';
import { DeleteScenarioMenuItem } from './DeleteScenarioMenuItem';
import { OpenScenarioMenuItem } from './OpenScenarioMenuItem';

export const ScenarioTableRowMenuButton = ({ scenario }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = anchorEl != null;
  const openMenuPopOver = (event) => setAnchorEl(event.currentTarget);
  const closeMenuPopOver = () => setAnchorEl(null);

  // TODO: refactor ShareScenarioButton not to depend from a FormProvider
  // Add a mock form to reuse the ShareScenarioButton (it needs a FormProvider)
  const mockFormMethods = useForm();

  return (
    <>
      <IconButton onClick={openMenuPopOver}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        elevation={8}
        open={open}
        onClose={closeMenuPopOver}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <EditScenarioButton autoFocus onClose={closeMenuPopOver} scenarioToEdit={scenario} variant="menuItem" />
        <OpenScenarioMenuItem scenarioId={scenario?.id} />
        <FormProvider {...mockFormMethods}>
          <ShareScenarioButton
            scenarioId={scenario.id}
            RolesEditionButtonProps={{ variant: 'menuItem', onClose: closeMenuPopOver }}
          />
        </FormProvider>
        <DeleteScenarioMenuItem scenario={scenario} />
      </Menu>
    </>
  );
};

ScenarioTableRowMenuButton.propTypes = {
  scenario: PropTypes.object,
};
