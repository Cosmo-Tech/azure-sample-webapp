import palette from '../palette'
import typography from '../typography'

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  root: {
    ...typography.body1,
    borderBottom: `1px solid ${palette.divider}`
  }
}
