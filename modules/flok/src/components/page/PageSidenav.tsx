import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  Tooltip
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import {
  AirportShuttleRounded,
  ExitToAppRounded,
  FlightRounded,
  ForumRounded,
  HomeRounded,
  ListRounded,
  LockOutlined,
  PersonRounded,
  SearchRounded
} from "@material-ui/icons"
import { push } from "connected-react-router"
import React, { PropsWithChildren, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Transition } from "react-transition-group"
import { AppRoutes } from "../../Stack"
import { deleteUserSignin } from "../../store/actions/user"
import CompanyGetters from "../../store/getters/company"
import UserGetters from "../../store/getters/user"
import { FlokTheme } from "../../theme"
import AppLogo from "../base/AppLogo"
import AppTypography from "../base/AppTypography"
import PageNav from "./PageNav"

let DRAWER_WIDTH = 240
let COLLAPSED_DRAWER_WIDTH = 80

const useStyles = makeStyles((theme: FlokTheme) => ({
  root: {
    zIndex: theme.zIndex.appBar - 1,
    [theme.breakpoints.up("md")]: {
      width: COLLAPSED_DRAWER_WIDTH,
      "&.collapsed $body": {
        width: COLLAPSED_DRAWER_WIDTH,
      },
    },
  },
  toolbar: {
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(4),
    height: 90,
  },
  body: {
    transition: "width .25s",
    backgroundColor: theme.custom.backgroundSecondary,
    width: DRAWER_WIDTH,
  },
  listItemRoot: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: theme.palette.text.secondary,
    "&.Mui-selected": {
      paddingLeft: theme.spacing(2) - 4,
      backgroundColor: "inherit",
      color: theme.palette.primary.main,
      borderLeftColor: theme.palette.primary.main,
      borderLeftWidth: 4,
      borderLeftStyle: "solid",
    },
  },
  listItemButton: {},
  listItemDisabled: {
    color: theme.palette.text.disabled,
  },
}))

const animationStyles = {
  entering: {},
  entered: {},
  exiting: {
    width: COLLAPSED_DRAWER_WIDTH,
  },
  exited: {
    width: COLLAPSED_DRAWER_WIDTH,
  },
}

let sidenavItems = {
  accomodations: ["Accomodations", <HomeRounded fontSize="inherit" />],
  search: ["Search", <SearchRounded fontSize="inherit" />],
  retreatDetails: ["Retreat Details", <ListRounded fontSize="inherit" />],
  employees: ["Proposals", <PersonRounded fontSize="inherit" />],
  retreatPlanner: ["Retreat Planner", <PersonRounded fontSize="inherit" />],
  itinerary: ["Itinerary", <ListRounded fontSize="inherit" />],
  flights: ["Flights", <FlightRounded fontSize="inherit" />],
  groundTrans: ["Transportation", <AirportShuttleRounded fontSize="inherit" />],
}

let sidenavAccountItems = {
  support: ["Support", <ForumRounded fontSize="inherit" />],
  logOut: ["Log out", <ExitToAppRounded fontSize="inherit" />],
}

let sidenavLoggedOutAccountItems = {
  logIn: ["Log in", <ExitToAppRounded fontSize="inherit" />],
}

let items = {
  ...sidenavItems,
  ...sidenavAccountItems,
  ...sidenavLoggedOutAccountItems,
}

type SidenavItemType = keyof typeof items
type PageSidenavProps = {
  activeItem?: SidenavItemType
}
export default function PageSidenav(
  props: PropsWithChildren<PageSidenavProps>
) {
  const classes = useStyles()
  let [open, setOpen] = useState(false)
  let dispatch = useDispatch()
  let userName = useSelector(UserGetters.getUserName)
  let userCompany = useSelector(CompanyGetters.getCompany)
  let loginStatus = useSelector(UserGetters.getLoginStatus)
  let [collapsed, setCollapsed] = useState(true)

  function SidenavListItem(props: {
    itemType: SidenavItemType
    activeItem?: SidenavItemType
    subItem?: boolean
    collapsed?: boolean
  }) {
    let {itemType, activeItem, subItem} = {...props}
    let selected = itemType === activeItem
    let disabled = [
      "retreatPlanner",
      "itinerary",
      "flights",
      "groundTrans",
    ].includes(itemType)
    let onClick = () => {
      if (!selected) {
        switch (itemType) {
          case "accomodations":
            dispatch(push(AppRoutes.getPath("AccomodationsSearchPage")))
            break
          case "logOut":
            dispatch(deleteUserSignin())
            break
          case "logIn":
            dispatch(push(AppRoutes.getPath("SigninPage")))
            break
          default:
            break
        }
      }
      setCollapsed(true)
    }
    let body = (
      <ListItem
        classes={{
          root: classes.listItemRoot,
          button: classes.listItemButton,
          disabled: classes.listItemDisabled,
        }}
        selected={selected}
        onClick={onClick}
        disabled={disabled}
        button
        key={itemType}>
        <Box
          marginLeft={subItem ? 2 : undefined}
          marginRight={!collapsed ? 1 : undefined}
          fontSize={subItem ? 16 : 22}>
          {items[itemType][1]}
        </Box>
        {collapsed ? undefined : (
          <>
            <AppTypography
              variant={subItem ? "body2" : "body1"}
              bold={selected}>
              {items[itemType][0]}
            </AppTypography>
            {disabled ? (
              <Box fontSize={subItem ? 12 : 16} marginLeft={1}>
                <LockOutlined fontSize="inherit" />
              </Box>
            ) : undefined}
          </>
        )}
      </ListItem>
    )
    return disabled ? (
      <Tooltip title="You paid sucka foo">
        {/* extra div because: https://github.com/mui-org/material-ui/issues/8416 */}
        <div>{body}</div>
      </Tooltip>
    ) : (
      body
    )
  }

  function SidenavList() {
    return (
      <List>
        {Object.keys(sidenavItems).map((item, i) => {
          return (
            <SidenavListItem
              itemType={item as SidenavItemType}
              activeItem={props.activeItem}
              key={i}
              subItem={
                !["retreatPlanner", "accomodations"].includes(
                  item as SidenavItemType
                )
              }
            />
          )
        })}
      </List>
    )
  }

  function SidenavAccountList() {
    return (
      <List>
        {Object.keys(
          loginStatus === "LOGGED_IN"
            ? sidenavAccountItems
            : sidenavLoggedOutAccountItems
        ).map((item, i) => {
          return (
            <SidenavListItem
              itemType={item as SidenavItemType}
              activeItem={props.activeItem}
              key={i}
            />
          )
        })}

        <Box
          paddingTop={1}
          paddingBottom={1}
          width={"80%"}
          marginLeft="auto"
          marginRight="auto">
          <Divider />
        </Box>
        {loginStatus === "LOGGED_IN" ? (
          <ListItem
            classes={{
              root: classes.listItemRoot,
            }}>
            <Box display="flex" flexDirection="column">
              <AppTypography variant="body1">{userName}</AppTypography>
              {userCompany && userCompany.name ? (
                <AppTypography variant="body2">
                  {userCompany.name}
                </AppTypography>
              ) : undefined}
            </Box>
          </ListItem>
        ) : (
          <ListItem
            classes={{
              root: classes.listItemRoot,
            }}>
            <Box display="flex" flexDirection="column">
              <AppTypography variant="body1">Guest</AppTypography>
            </Box>
          </ListItem>
        )}
      </List>
    )
  }

  function DrawerBody(props: {
    logoSize?: "small" | "large"
    collapsed?: boolean
  }) {
    return (
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
        className={classes.body}>
        <Box>
          <Box className={classes.toolbar}>
            {props.collapsed ? (
              <AppLogo noBackground height={45} />
            ) : (
              <AppLogo
                noBackground
                withText
                height={props.logoSize === "small" ? 35 : 45}
              />
            )}
          </Box>
          <SidenavList />
        </Box>
        <Box marginBottom={1}>
          <Box width={"80%"} marginLeft="auto" marginRight="auto">
            {/* <Divider /> */}
          </Box>
          <SidenavAccountList />
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Hidden smDown>
        <Transition in={!collapsed} addEndListener={() => undefined}>
          <Drawer
            onMouseEnter={() => setCollapsed(false)}
            onMouseLeave={() => setCollapsed(true)}
            className={`${classes.root} ${collapsed ? "collapsed" : ""}`}
            style={animationStyles[collapsed ? "exited" : "entered"]}
            classes={{paper: classes.body}}
            variant="permanent">
            <DrawerBody logoSize="large" collapsed={collapsed} />
          </Drawer>
        </Transition>
      </Hidden>
      <Hidden mdUp>
        <PageNav onMenuClick={() => setOpen(true)} />
      </Hidden>
      <Hidden mdUp>
        <Drawer
          className={classes.root}
          classes={{paper: classes.body}}
          variant="temporary"
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}>
          <DrawerBody logoSize="small" />
        </Drawer>
      </Hidden>
    </>
  )
}
