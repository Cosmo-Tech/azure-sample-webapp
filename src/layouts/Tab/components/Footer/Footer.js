import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: `0 ${theme.spacing(3)}px ${theme.spacing(2)}px ${theme.spacing(3)}px`
  }
}))

const Footer = props => {
  const { className, ...rest } = props
  const classes = useStyles()
  const year = new Date().getFullYear()

  return (
    <footer
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography variant="caption">
        &copy; Powered by CosmoTech. {year}
      </Typography>
    </footer>
  )
}

Footer.propTypes = {
  className: PropTypes.string
}

export default Footer
