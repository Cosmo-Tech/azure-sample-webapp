// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import Countdown from 'react-countdown';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    marginTop: '16px',
  },
  dialogActions: {
    marginRight: '4px',
    marginBottom: '4px',
  },
}));

export const SessionTimeoutDialog = ({ getRemainingTimeLabel, labels, onClose, onLogOut, open, timeout }) => {
  const classes = useStyles();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logOutAfterTimeout = () => {
    setIsLoggingOut(true);
    onLogOut({ timeout: true });
  };
  const logOutAfterClick = () => {
    setIsLoggingOut(true);
    onLogOut({ timeout: false });
  };

  const timeoutRenderer = ({ seconds }) => {
    return <Typography>{getRemainingTimeLabel(seconds)}</Typography>;
  };

  return (
    <Dialog
      data-cy="session-timeout-dialog"
      open={open}
      aria-labelledby="form-dialog-title"
      maxWidth={'sm'}
      fullWidth={true}
      onClose={onClose}
    >
      <DialogTitle id="form-dialog-title">{labels.title}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {isLoggingOut ? (
          labels.loggingOut
        ) : (
          <Countdown date={Date.now() + timeout * 1000} renderer={timeoutRenderer} onComplete={logOutAfterTimeout} />
        )}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button id="logout" onClick={logOutAfterClick} color="primary" disabled={isLoggingOut}>
          {labels.logOut}
        </Button>
        {/* TODO Replace 'cancel' with 'stay connected' which is more accurate */}
        <Button id="cancel" onClick={onClose} color="primary" variant="contained" disabled={isLoggingOut}>
          {labels.cancel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SessionTimeoutDialog.propTypes = {
  getRemainingTimeLabel: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    body: PropTypes.string.isRequired,
    cancel: PropTypes.string.isRequired,
    logOut: PropTypes.string.isRequired,
    loggingOut: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  timeout: PropTypes.number.isRequired,
};

SessionTimeoutDialog.defaultProps = {
  labels: {
    body: 'You have been idle for too long. You will be automatically disconnected in a few seconds...',
    cancel: 'Cancel',
    logOut: 'Sign out',
    loggingOut: 'Signing out...',
    title: 'Session timeout',
  },
};
