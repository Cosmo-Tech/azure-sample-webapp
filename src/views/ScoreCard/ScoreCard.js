// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStyles = theme => ({
  root: {
    margin: 'auto',
    width: '100%'
  }
})

const ScoreCard = (props) => {
  return (
      <div className={props.classes.root}>
        SCORE CARD
      </div>
  )
}

ScoreCard.propTypes = {
  classes: PropTypes.any
}

export default withStyles(useStyles)(ScoreCard)
