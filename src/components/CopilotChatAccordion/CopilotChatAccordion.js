import React from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CopilotChat from '../CopilotChat/CopilotChat';

const useStyles = makeStyles(() => ({
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

const CopilotChatAccordion = ({ onToggleAccordion, isAccordionExpanded }) => {
  const classes = useStyles();
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
              <Typography>Cosmo Tech AI Copilot</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <CopilotChat />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

CopilotChatAccordion.propTypes = {
  onToggleAccordion: PropTypes.func.isRequired,
  isAccordionExpanded: PropTypes.bool.isRequired,
};

export default CopilotChatAccordion;
