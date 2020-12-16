import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Card, CardContent, CardMedia } from '@material-ui/core'

const useStyles = theme => ({
  iframe: {
    display: 'block',
    height: '100%'
  },
  placeholder: {
    backgroundColor: theme.palette.background.secondary,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px'
  },
  label: {
    height: '14px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0',
    lineHeight: '14px'
  },
  card: {
    width: '100%',
    background: theme.palette.background.secondary,
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    margin: '16px',
    marginLeft: '8px',
    marginBottom: '4px',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 18,
    padding: 0,
    letterSpacing: 0
  },
  cardContent: {
    padding: `${theme.spacing(1)}px`,
    flexGrow: '1'
  }
})

class IframeScenarioResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enabled: true
    }
  }

  render () {
    const { classes, iframeTitle, cardTitle, cardStyle, ...otherProps } = this.props
    return (
        <Card style={cardStyle} className={classes.card}>
          <Typography variant='h5' component='h2' className={classes.cardTitle}>
            {cardTitle}
          </Typography>
          <CardContent className={classes.cardContent}>
            { this.state.enabled &&
              <CardMedia
                className={classes.iframe}
                title={iframeTitle}
                component="iframe"
                src={otherProps.src} {...otherProps}/>
            }
            { !this.state.enabled &&
              <Typography
                variant="caption"
                component="p"
                color="textSecondary"
                className={classes.label}
              >No results for this scenario.</Typography>
            }
          </CardContent>
        </Card>
    )
  }
}

IframeScenarioResults.propTypes = {
  classes: PropTypes.any,
  iframeTitle: PropTypes.string.isRequired,
  cardTitle: PropTypes.string.isRequired,
  cardStyle: PropTypes.any,
  src: PropTypes.string.isRequired
}

export default withStyles(useStyles)(IframeScenarioResults)
