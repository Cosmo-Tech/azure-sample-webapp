import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Button, TextField, Dialog, DialogActions, FormControlLabel,
  DialogTitle, DialogContent, Checkbox, Grid
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DropdownScenario from '../../components/DropdownScenario'

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  dialogcontent: {
    marginLeft: '20px',
    marginRight: '20px'
  },
  dialogactions: {
    marginRight: '30px',
    marginTop: '20px',
    marginBottom: '5px'
  }
})

const DialogCreateScenario = (props) => {
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
      <Button startIcon={<AddIcon />} variant="text" onClick={handleClickOpen} color="primary">
        Create Alternate Scenario
      </Button>
      <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title"
        maxWidth={'sm'}
        fullWidth={true}
        disableBackdropClick
      >
        <DialogTitle id="form-dialog-title" className={props.classes.dialogcontent}>CREATE ALTERNATIVE SCENARIO</DialogTitle>
        <DialogContent className={props.classes.dialogcontent}>
          <Grid container spacing={2}>
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
                options={['Simulation', 'Optimisation']}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Scenario" label="Scenario Type" variant="outlined"/>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={props.classes.dialogactions}>
          <Button id="ButtonCancel" onClick={handleDialogClose} color="primary">
            CANCEL
          </Button>
          <Button id="ButtonCreate" onClick={createScenario} color="primary">
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
