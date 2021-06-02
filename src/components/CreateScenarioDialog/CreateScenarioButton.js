import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Typography, withStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';
import CreateScenarioDialog from './CreateScenarioDialog';

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  dialogContent: {
    marginLeft: '20px',
    marginRight: '20px'
  },
  dialogActions: {
    marginRight: '30px',
    marginTop: '20px',
    marginBottom: '5px'
  }
});

const CreateScenarioButton = ({
  classes,
  currentScenario,
  datasets,
  scenarios,
  runTemplates,
  user,
  createScenario,
  workspaceId,
  solution
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <div>
      <Button size="medium" startIcon={<AddIcon />} variant="text" onClick={openDialog} color="primary">
        <Typography noWrap color="primary">{t('commoncomponents.button.create.scenario', 'Create Alternative Scenario')}</Typography>
      </Button>
      <CreateScenarioDialog
          createScenario={createScenario}
          workspaceId={workspaceId}
          solution={solution}
          open={open}
          currentScenario={currentScenario}
          datasets={datasets}
          classes={classes}
          closeDialog={closeDialog}
          runTemplates={runTemplates}
          scenarios={scenarios}
          user={user} />
    </div>
  );
};

CreateScenarioButton.propTypes = {
  classes: PropTypes.any,
  currentScenario: PropTypes.object,
  scenarios: PropTypes.array.isRequired,
  datasets: PropTypes.array.isRequired,
  runTemplates: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  createScenario: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  solution: PropTypes.object.isRequired
};

export default withStyles(useStyles)(CreateScenarioButton);
