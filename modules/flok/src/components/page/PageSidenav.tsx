import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  Tooltip,
} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import {
  AddRounded,
  CreditCardRounded,
  ExitToAppRounded,
  FlightRounded,
  ForumRounded,
  HomeRounded,
  ListRounded,
  LockOutlined,
  PersonRounded,
} from "@material-ui/icons"
import {push} from "connected-react-router"
import React, {PropsWithChildren, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {AppRoutes} from "../../Stack"
import {deleteUserSignin} from "../../store/actions/user"
import CompanyGetters from "../../store/getters/company"
import UserGetters from "../../store/getters/user"
import {FlokTheme} from "../../theme"
import AppLogo from "../base/AppLogo"
import AppTypography from "../base/AppTypography"
import PageNav from "./PageNav"

let DRAWER_WIDTH = 240

const useStyles = makeStyles((theme: FlokTheme) => ({
  root: {
    zIndex: theme.zIndex.appBar - 1,
    [theme.breakpoints.up("md")]: {
      width: DRAWER_WIDTH,
    },
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  body: {
    backgroundColor: theme.custom.backgroundGrey,
    width: DRAWER_WIDTH,
  },
  listItemRoot: {
    color: theme.palette.text.secondary,
    "&.Mui-selected": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
      backgroundColor: "inherit",
    },
  },
  listItemButton: {},
  listItemDisabled: {
    color: theme.palette.text.disabled,
  },
}))

let sidenavItems = {
  accomodations: ["Accomodations", <HomeRounded />],
  onboarding: ["Onboarding", <ListRounded />],
  employees: ["Employees", <PersonRounded />],
  flights: ["Flights", <FlightRounded />],
  corpCard: ["Corporate cards", <CreditCardRounded />],
  bestPractices: ["Retreat best practices", <AddRounded />],
  addOns: ["Retreat add ons", <CreditCardRounded />],
}

let sidenavAccountItems = {
  support: ["Support", <ForumRounded />],
  logOut: ["Log out", <ExitToAppRounded />],
}

let sidenavLoggedOutAccountItems = {
  logIn: ["Log in", <ExitToAppRounded />],
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

  function SidenavListItem(props: {
    itemType: SidenavItemType
    activeItem?: SidenavItemType
  }) {
    let {itemType, activeItem} = {...props}
    let selected = itemType === activeItem
    let disabled = ![
      "accomodations",
      "onboarding",
      "logOut",
      "logIn",
      "support",
    ].includes(itemType)
    let onClick = () => {
      if (!selected) {
        switch (itemType) {
          case "onboarding":
            dispatch(push(AppRoutes.getPath("HomePage")))
            break
          case "accomodations":
            dispatch(push(AppRoutes.getPath("AccomodationsPage")))
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
        <Box marginRight={1}>{items[itemType][1]}</Box>
        {items[itemType][0]}
        {disabled ? (
          <Box fontSize={14} marginLeft={1}>
            <LockOutlined fontSize="inherit" />
          </Box>
        ) : undefined}
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

  function DrawerBody(props: {logoSize?: "small" | "large"}) {
    return (
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
        className={classes.body}>
        <Box>
          <Box className={classes.toolbar}>
            <AppLogo
              noBackground
              withText
              height={props.logoSize === "small" ? 35 : 45}
            />
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
        <Drawer
          className={classes.root}
          classes={{paper: classes.body}}
          variant="permanent">
          <DrawerBody logoSize="large" />
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        <PageNav onMenuClick={() => setOpen(true)} />
      </Hidden>

      <Hidden mdUp>
        <Drawer
          className={classes.root}
          classes={{paper: classes.body}}
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}>
          <DrawerBody logoSize="small" />
        </Drawer>
      </Hidden>
    </>
  )
}
