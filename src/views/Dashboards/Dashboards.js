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

const Dashboards = (props) => {
  return (
      <div className={props.classes.root}>
        <iframe title="reportDashboard1" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=018525c4-3fed-49e7-9048-6d6237e80145&autoAuth=true&ctid=e9641c78-d0d6-4d09-af63-168922724e7f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWZyYW5jZS1jZW50cmFsLWEtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" frameBorder="0" allowFullScreen={true}></iframe>
      </div>
  )
}

Dashboards.propTypes = {
  classes: PropTypes.any
}

export default withStyles(useStyles)(Dashboards)
