// copyright (c) cosmo tech corporation.
// licensed under the mit license.

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = theme => ({
  root: {
    margin: 'auto',
    width: '100%'
  }
})

class ScenarioManager extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        SCENARIO MANAGER
      </div>
    )
  }
}

ScenarioManager.propTypes = {
  classes: PropTypes.any
}

export default withStyles(useStyles)(ScenarioManager)
