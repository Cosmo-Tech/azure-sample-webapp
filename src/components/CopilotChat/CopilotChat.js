import React, { useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';
import { useFetchToken, useGetCopilotToken } from '../../state/hooks/CopilotHooks';

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
  const copilotToken = useGetCopilotToken();
  // const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5MZjUwanFheTN1R0VpQUpOV29EWmZzRnE4QSIsIng1dCI6Ik5MZjUwanFheTN1R0VpQUpOV29EWmZzRnE4QSIsInR5cCI6IkpXVCJ9.eyJib3QiOiJjc20tbGxtLWFib3QiLCJzaXRlIjoiLUY5RzhrbXQ2TkkiLCJjb252IjoiQzlaQmRBVzlMa0FLYjNyUE9RckFkNi1ldSIsIm5iZiI6MTcxMTYxNjA2OCwiZXhwIjoxNzExNjE5NjY4LCJpc3MiOiJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8iLCJhdWQiOiJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8ifQ.CTiPsMnBMiG2Ks1S6pOY6vpjREL3bub3o842U2bBZHS8sGoEvUCJxrIsMpHxlHgTukUmXi1cyUzR2Tbd_7ThQWCOKEGcLISV3AOfGUcUhPdU6yhHJ7uq8Y1Lw8fyvqJas3P2KfP6w8qA0jYcgzCiEW6nS9Jh2Dl6b1YVp2sHGoCZIKqUPZW4N4M3vNgYq5Ez1rBW1QDFn3KGSNNzqHXAAn6V7vWJds7_BZc5HO_zAFknEe9mU6pzTgZQvwUQt_BLrLyp7RHXy1F8lf4HlSQFEexuPQuuoRi0bpuG4fsIBgl5-5__okN2GL0LJR3HGwPSppyBp5xsmlqo3PifA5AogA';

  const fetchToken = useFetchToken();
  useEffect(() => {
    fetchToken();
  }, []);


  console.log(`REDUX COPILOT TOKEN: ${copilotToken}`);
  const directLine = useMemo(() => copilotToken ? createDirectLine({ token: copilotToken }) : null, [copilotToken]);

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
          {copilotToken ? <div className={classes.copilotChat}><ReactWebChat directLine={directLine} userID="vince" /> </div> : <div>Waiting for token...</div> }
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
