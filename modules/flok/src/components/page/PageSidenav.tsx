import {
  Box,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles
} from "@material-ui/core"
import {
  ApartmentRounded,
  Close,
  FlightRounded,
  HomeRounded,
  MapRounded,
  Menu,
  PeopleAlt,
  SvgIconComponent
} from "@material-ui/icons"
import { push } from "connected-react-router"
import React, { PropsWithChildren, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import AppImage from "../../components/base/AppImage"
import { AppRoutes, FlokPageName } from "../../Stack"
import { RootState } from "../../store"
import { deleteUserSignin } from "../../store/actions/user"
import { FlokTheme } from "../../theme"

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
  footer: {
    marginTop: "auto",
    marginBottom: theme.spacing(2),
  },
}))

let navItem = (title: string, Icon: SvgIconComponent, pageName: FlokPageName) =>
  [title, <Icon fontSize="large" />, pageName] as const

let navItems = {
  overview: navItem("Overview", HomeRounded, "RetreatHomePage"),
  lodging: navItem("Lodging", ApartmentRounded, "ProposalsListPage"),
  attendees: navItem("Attendees", PeopleAlt, "RetreatAttendeesPage"),
  flights: navItem("Flights", FlightRounded, "RetreatFlightsPage"),
  itinerary: navItem("Itinerary", MapRounded, "RetreatItineraryPage"),
}

type SidenavItemType = keyof typeof navItems
type PageSidenavProps = {
  retreatIdx: number
  activeItem?: SidenavItemType
  companyName?: string
}
export default function PageSidenav(
  props: PropsWithChildren<PageSidenavProps>
) {
  let dispatch = useDispatch()
  const classes = useStyles()

  let [isMobile, setIsMobile] = useState(
    window.innerWidth <= 720 ? true : false
  )
  let [open, setOpen] = useState(false)
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 720) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  })

  let isLoggedIn = useSelector(
    (state: RootState) => state.user.loginStatus === "LOGGED_IN"
  )

  return (
    <>
      {isMobile && (
        <IconButton onClick={() => setOpen(true)} style={{height: 64}}>
          <Menu fontSize="large" />
        </IconButton>
      )}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        classes={{root: classes.root, paper: classes.paper}}
        variant={isMobile ? "temporary" : "permanent"}>
        <Box
          marginLeft="auto"
          marginRight="auto"
          marginBottom={4}
          style={{display: "flex", alignItems: "flex-end"}}>
          <AppImage
            height="40px"
            alt="White Flok logo"
            img="branding/logos/icon_text-empty_bg-white%40.5x.png"
          />
          {isMobile ? (
            <IconButton style={{color: "white"}} onClick={() => setOpen(false)}>
              <Close fontSize="large" />
            </IconButton>
          ) : (
            <></>
          )}
        </Box>
        <List>
          {Object.keys(navItems).map((item, index) => {
            let sidenavItem = item as SidenavItemType
            const itemTup = navItems[sidenavItem]
            return (
              <ListItem
                button
                selected={props.activeItem === sidenavItem}
                onClick={() => {
                  dispatch(
                    push(
                      AppRoutes.getPath(itemTup[2], {
                        retreatIdx: props.retreatIdx.toString(),
                      })
                    )
                  )
                }}>
                <ListItemIcon>{itemTup[1]}</ListItemIcon>
                <ListItemText>{itemTup[0]}</ListItemText>
              </ListItem>
            )
          })}
        </List>
        <List className={classes.footer}>
          {props.companyName && (
            <ListItem>
              <ListItemText>{props.companyName}</ListItemText>
            </ListItem>
          )}
          {isLoggedIn && (
            <Link
              component={ListItem}
              color="inherit"
              button
              dense
              onClick={() => {
                dispatch(deleteUserSignin())
              }}>
              <ListItemText>Log out</ListItemText>
            </Link>
          )}
        </List>
      </Drawer>
    </>
  )
}
