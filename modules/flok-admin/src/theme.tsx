import {Theme} from "@material-ui/core"
import {
  createMuiTheme,
  ThemeOptions as MuiThemeOptions,
} from "@material-ui/core/styles"
import {ExpandMore} from "@material-ui/icons"

export interface FlokTheme extends Theme {}

// These values are defined as constants
//  so they can be referenced in multiple places
//  throughout the call to createMuiTheme
const VALUES = {
  colors: {
    primary: {
      main: "#4b51ff",
    },
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  borderRadius: 10,
}

export const theme = createMuiTheme({
  palette: {
    text: {
      primary: "rgba(0,0,0,.75)",
    },
    background: {
      default: "#EFF1F7",
      paper: "#ffffff",
    },
    primary: {
      light: "#b1b5ff",
      main: VALUES.colors.primary.main,
      dark: "#1c1e68",
    },
    secondary: undefined,
    warning: {
      main: "#f0b728",
    },
    success: {
      main: "#78d6bd",
    },
  },
  typography: {
    fontWeightLight: VALUES.fontWeight.light,
    fontWeightRegular: VALUES.fontWeight.regular,
    fontWeightMedium: VALUES.fontWeight.medium,
    fontWeightBold: VALUES.fontWeight.bold,
    h1: {
      fontSize: "1.75rem",
      lineHeight: 1.2,
      fontWeight: VALUES.fontWeight.bold,
    },
    h2: {
      fontSize: "1.5rem",
      lineHeight: 1.2,
      fontWeight: VALUES.fontWeight.regular,
    },
    h3: {
      fontSize: "1.25rem",
      lineHeight: 1.2,
      fontWeight: VALUES.fontWeight.regular,
    },
    h4: {
      fontSize: "1.125rem",
      lineHeight: 1.2,
      fontWeight: VALUES.fontWeight.bold,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.2,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.2,
    },
    subtitle1: {},
    subtitle2: {},
    button: {
      textTransform: undefined,
    },
  },
  shape: {borderRadius: VALUES.borderRadius},
  props: {
    MuiSelect: {
      IconComponent: ExpandMore,
      native: true,
      variant: "outlined",
    },
    MuiSvgIcon: {
      color: "inherit",
    },
    MuiTextField: {
      variant: "outlined",
    },
  },
  overrides: {
    MuiSvgIcon: {
      root: {verticalAlign: "middle"},
    },
    MuiListItem: {
      root: {borderRadius: VALUES.borderRadius},
    },
    MuiListItemIcon: {
      root: {color: "inherit"},
    },
  },
} as MuiThemeOptions)
