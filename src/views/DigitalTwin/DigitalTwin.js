import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = theme => ({
  root: {
    margin: 'auto',
    width: '100%'
  }
})

class DigitalTwin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        DIGITAL TWIN
      </div>
    )
  }
}

DigitalTwin.propTypes = {
  classes: PropTypes.any
}

export default withStyles(useStyles)(DigitalTwin)
