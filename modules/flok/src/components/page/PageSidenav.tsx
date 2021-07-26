import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core"
import {
  FlightRounded,
  HomeRounded,
  ListRounded,
  MapRounded,
  PersonRounded,
  SvgIconComponent,
} from "@material-ui/icons"
import {push} from "connected-react-router"
import React, {PropsWithChildren} from "react"
import {useDispatch} from "react-redux"
import AppImage from "../../components/base/AppImage"
import {AppRoutes} from "../../Stack"
import {FlokTheme} from "../../theme"

let DRAWER_WIDTH = 240

const useStyles = makeStyles((theme: FlokTheme) => ({
  root: {
    width: DRAWER_WIDTH,
  },
  paper: {
    width: DRAWER_WIDTH,
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),

    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}))

let navItem = (title: string, Icon: SvgIconComponent, pageName: string) => [
  title,
  <Icon fontSize="large" />,
  pageName,
]

let navItems = {
  overview: navItem("Overview", ListRounded, "OverviewPage"),
  lodging: navItem("Lodging", HomeRounded, "LodgingFormPage"),
  attendees: navItem("Attendees", PersonRounded, "AttendeesPage"),
  flights: navItem("Flights", FlightRounded, "FlightsPage"),
  itinerary: navItem("Itinerary", MapRounded, "ItineraryPage"),
}

type SidenavItemType = keyof typeof navItems
type PageSidenavProps = {
  activeItem?: SidenavItemType
}
export default function PageSidenav(
  props: PropsWithChildren<PageSidenavProps>
) {
  let dispatch = useDispatch()
  const classes = useStyles()

  return (
    <Drawer
      classes={{root: classes.root, paper: classes.paper}}
      variant="permanent">
      <Box marginLeft="auto" marginRight="auto" marginBottom={4}>
        <AppImage
          height="40px"
          alt="White Flok logo"
          img="branding/logos/icon_text-empty_bg-white%40.5x.png"
        />
      </Box>
      <List>
        {Object.keys(navItems).map((item, index) => {
          let sidenavItem = item as SidenavItemType
          const itemTup = navItems[sidenavItem] as [string, JSX.Element, string]
          return (
            <ListItem
              button
              selected={props.activeItem === sidenavItem}
              onClick={() => dispatch(push(AppRoutes.getPath(itemTup[2])))}>
              <ListItemIcon>{itemTup[1]}</ListItemIcon>
              <ListItemText>{itemTup[0]}</ListItemText>
            </ListItem>
          )
        })}
      </List>
    </Drawer>
  )
}
