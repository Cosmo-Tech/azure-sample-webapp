import palette from '../palette'

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  root: {
    '&$selected': {
      backgroundColor: palette.background.default
    },
    '&$hover': {
      '&:hover': {
        backgroundColor: palette.background.default
      }
    }
  }
}
