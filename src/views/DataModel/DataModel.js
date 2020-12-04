import React from 'react';
import { withStyles } from '@material-ui/core/styles';


const useStyles = theme => ({
  root: {
    margin: 'auto',
    width: '100%',
  },
});

class DataModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        DATA MODEL
      </div>
    );
  }
}

export default withStyles(useStyles)(DataModel);
