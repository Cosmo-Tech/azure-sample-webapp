// copyright (c) cosmo tech corporation.
// licensed under the mit license.

import palette from '../palette'

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
