import {createMuiTheme} from "@material-ui/core/styles"

export const theme = createMuiTheme({
  mixins: {
    toolbar: {
      height: 56,
      maxHeight: 56,
      "@media (min-width:0px) and (orientation: landscape)": {
        height: 48,
        maxHeight: 48,
      },
      "@media (min-width:600px)": {
        maxHeight: 64,
        height: 64,
      },
    },
  },
})
