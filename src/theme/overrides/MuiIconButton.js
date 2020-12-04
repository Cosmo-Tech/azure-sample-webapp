import palette from '../palette';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  root: {
    color: palette.black,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)'
    }
  }
};
