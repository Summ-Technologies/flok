import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Toolbar,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import React, {useState} from "react"
import AppTypography from "../base/AppTypography"

type PageNavProps = {}
export default function PageNav(props: PageNavProps) {
  let [sideNavOpen, setSideNavOpen] = useState(false)
  return (
    <>
      <PageTopNav onClickMenu={() => setSideNavOpen(!sideNavOpen)} />
      <PageSideNav open={sideNavOpen} onClose={() => setSideNavOpen(false)} />
    </>
  )
}

let useSideNavStyles = makeStyles((theme) => ({
  root: {},
  title: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginLeft: "auto",
    marginRight: "auto",
  },
  list: {
    width: 250,
  },
}))

type PageSideNavProps = {
  open: boolean
  onClose: () => void
}
function PageSideNav(props: PageSideNavProps) {
  let classes = useSideNavStyles(props)
  return (
    <Drawer open={props.open} onClose={props.onClose} variant={"temporary"}>
      <AppTypography className={classes.title} variant="h3" fontWeight="bold">
        Flok Admin
      </AppTypography>
      <List className={classes.list}>
        <ListItem button>
          <ListItemText>Retreats</ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemText>Flight groups</ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemText>Lodging content</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  )
}

let useTopNavStyles = makeStyles((theme) => ({
  menuIcon: {
    marginRight: theme.spacing(2),
  },
}))

type PageTopNavProps = {
  onClickMenu: () => void
}
function PageTopNav(props: PageTopNavProps) {
  let classes = useTopNavStyles(props)
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          className={classes.menuIcon}
          onClick={props.onClickMenu}
          edge="start"
          color="inherit"
          aria-label="menu">
          <MenuIcon />
        </IconButton>
        <AppTypography variant="h3" fontWeight="bold">
          Flok Admin
        </AppTypography>
      </Toolbar>
    </AppBar>
  )
}
