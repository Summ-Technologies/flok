import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  useMediaQuery,
} from "@material-ui/core"
import {Menu} from "@material-ui/icons"
import React from "react"
import {FlokTheme} from "../../theme"
import AppImage from "../base/AppImage"
import {useSidebar} from "./PageSidenav"

let useStyles = makeStyles((theme) => ({
  root: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
}))

// Should change this to PageHeader.tsx once getting-started page stops using the component
type PageAppBarProps = {}
export default function PageAppBar(props: PageAppBarProps) {
  let classes = useStyles(props)
  let {openSidebar} = useSidebar()
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )
  return isSmallScreen ? (
    <AppBar className={classes.root} position={"sticky"} color={"primary"}>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          edge="start"
          size="medium"
          color="inherit"
          onClick={openSidebar}>
          <Menu />
        </IconButton>
        <AppImage
          height="30px"
          alt="White Flok logo"
          img="branding/logos/icon_text-empty_bg-white%40.5x.png"
        />
      </Toolbar>
    </AppBar>
  ) : (
    <></>
  )
}
