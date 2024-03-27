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
  const fetchToken = useFetchToken();
  useEffect(() => {
    fetchToken();
  }, []);

  console.log(`REDUX COPILOT TOKEN: ${copilotToken}`);
  const directLine = useMemo(() => createDirectLine({ token: copilotToken }), []);

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
