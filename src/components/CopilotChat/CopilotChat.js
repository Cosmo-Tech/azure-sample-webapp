import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';

const useStyles = makeStyles((theme) => ({
  accordionSummary: {
    flexDirection: 'row-reverse',
  },
  accordionDetailsContent: {
    width: '100%',
  },
  gridContainerSummary: {
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridSummary: {
    marginLeft: '10px',
  },
  copilotChat: {
    width: '100%',
    height: '450px',
  },
}));

const CopilotChat = ({ onToggleAccordion, isAccordionExpanded }) => {
  const classes = useStyles();

  /* const botTokenResponse = it fetch("../token");
  json = await response.json()
  console.log("Token response: " + JSON.stringify(json))
  const token = json.token
  */
  const token =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5MZjUwanFheTN1R0VpQUpOV29EWmZzRnE4QSIsIng1dCI6Ik5MZjUwanFheTN1R0VpQUpOV29EWmZzRnE4QSIsInR5cCI6IkpXVCJ9.eyJib3QiOiJjc20tbGxtLWFib3QiLCJzaXRlIjoiLUY5RzhrbXQ2TkkiLCJjb252IjoiSW1yd0ZCRlQ0ejkySVlIcmxmckhxUi1mciIsIm5iZiI6MTcxMTU1NDUzNywiZXhwIjoxNzExNTU4MTM3LCJpc3MiOiJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8iLCJhdWQiOiJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8ifQ.MejIZ_oR5JWMMQ1CxRaSTKMZPwjN5FYwIF6vxcM5N_1QrBBt6rUY1unwoQSrbHjrQcMesXYKLKmi2s4MXuiZzLfMA8pDtwwzVEKgxtS_BRS-UxgvWa2BHLeyA821-vTKh7hjfD6OAtjS902wWJQOod5eGHxFp0KqH8T3ivmOTtsOAA2SlCn294QdBX-IFScEc7cJKWTWy8zry7FkK4bJ0-O2fuaGeB6sM6Cpmzc7jBC4XJb5GwZ-fofDLxRtjmYdbd6wHd0NKw6wbetUY0KB4K17x7LEDzxH9IvtzrqQ74KwO4L2D9IvWGzY8_oYveRGNRGSFrzt-8sjYAJ9JlV1iw';
  const directLine = useMemo(() => createDirectLine({ token: token }), []);

  return (
    <div>
      <Accordion data-cy="scenario-params-accordion" expanded={isAccordionExpanded}>
        <AccordionSummary
          data-cy="scenario-params-accordion-summary"
          className={classes.accordionSummary}
          expandIcon={<ExpandMoreIcon />}
          onClick={onToggleAccordion}
        >
          <Grid container className={classes.gridContainerSummary}>
            <Grid className={classes.gridSummary}>
              <Typography>Cosmo Tech Copilot</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.copilotChat}>
            <ReactWebChat directLine={directLine} userID="vince" />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

CopilotChat.propTypes = {
  onToggleAccordion: PropTypes.func.isRequired,
  isAccordionExpanded: PropTypes.bool.isRequired,
};

export default CopilotChat;
