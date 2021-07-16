import {AppBar, Box, IconButton, Toolbar} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import {MenuRounded} from "@material-ui/icons"
import React, {PropsWithChildren} from "react"
import {FlokTheme} from "../../theme"
import AppLogo from "../base/AppLogo"

const useStyles = makeStyles((theme: FlokTheme) => ({
  root: {
    ...theme.mixins.toolbar,
  },
  left: {
    marginRight: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
  },
  right: {},
}))

type PageNavProps = {
  onMenuClick: () => void
}
export default function PageNav(props: PropsWithChildren<PageNavProps>) {
  const classes = useStyles()
  return (
    <AppBar
      variant="outlined"
      color="inherit"
      position="fixed"
      className={`${classes.root}`}>
      <Toolbar>
        <Box flex={1}>
          <IconButton size="small" onClick={props.onMenuClick}>
            <MenuRounded fontSize="large" />
          </IconButton>
        </Box>
        <Box className={classes.left}>
          <AppLogo
            className={classes.right}
            noBackground
            withText
            height={30}
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
