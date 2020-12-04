import React from 'react';
import { withStyles } from '@material-ui/core/styles';


const useStyles = theme => ({
  root: {
    margin: 'auto',
    width: '100%',
  },
});

class Dashboards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <iframe title="reportDashboard1" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=018525c4-3fed-49e7-9048-6d6237e80145&autoAuth=true&ctid=e9641c78-d0d6-4d09-af63-168922724e7f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWZyYW5jZS1jZW50cmFsLWEtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" frameBorder="0" allowFullScreen={true}></iframe>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboards);
