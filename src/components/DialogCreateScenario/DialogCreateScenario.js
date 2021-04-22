import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Button, TextField, Dialog, DialogActions, FormControlLabel,
  DialogTitle, DialogContent, Checkbox, Grid
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DropdownScenario from '../../components/DropdownScenario'

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  dialog: {
    height: '100%'
  },
  autocomplete: {
    margin: '20px'
  },
  grid: {
    flexGrow: 1
  }
})

const DialogCreateScenario = () => {
  const [open, setOpen] = useState(false)
  const [master, setMaster] = useState(true)
  const [scenario, setStateScenario] = useState(null)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleDialogClose = () => {
    setOpen(false)
  }

  const handleScenarioMasterChange = (event) => {
    setMaster(event.target.checked)
  }

  const createScenario = () => {
    scenario.reduce()
    master.reduce()
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        + Create Alternate Scenario
      </Button>
      <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title"
        maxWidth={'sm'}
        fullWidth={true}
        disableBackdropClick
      >
        <DialogTitle id="form-dialog-title">CREATE ALTERNATIVE SCENARIO</DialogTitle>
        <DialogContent>
          <Grid container style={{ width: '100%', padding: '10px', color: '#F8F9F8' }} spacing={2}>
            <Grid item xs={12}>
              <TextField autoFocus margin="dense" id="scenarioName" label="Scenario Name" fullWidth/>
            </Grid>
            <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={true}
                  onChange={handleScenarioMasterChange}
                  name="checkScenarioMaster"
                  color="primary"
                />
              }
              label="Master"
            />
            </Grid>
            <Grid item xs={12}>
              <DropdownScenario setScenario={(sc) => (setStateScenario(sc))}>
              </DropdownScenario>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="senarioType"
                options={['Emulateur SNES', 'Emulateur MD']}
                getOptionLabel={(option) => option}
                style={{ width: '100%', marginLeft: '20px', paddingRight: '30px' }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Scenario" label="Scenario Type" variant="outlined"/>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            CANCEL
          </Button>
          <Button onClick={createScenario} color="primary">
            CREATE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

DialogCreateScenario.propTypes = {
  classes: PropTypes.any
}

export default withStyles(useStyles)(DialogCreateScenario)
