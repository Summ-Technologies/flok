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
import AppLogo from "../base/AppLogo"
import AppTypography from "../base/AppTypography"
import PageNav from "./PageNav"

let DRAWER_WIDTH = 240

const useStyles = makeStyles((theme) => ({
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
  onboarding: ["Onboarding", <HomeRounded />],
  employees: ["Employees", <PersonRounded />],
  flights: ["Flights", <FlightRounded />],
  accomodations: ["Accomodations", <HomeRounded />],
  corpCard: ["Corporate cards", <CreditCardRounded />],
  bestPractices: ["Retreat best practices", <AddRounded />],
  addOns: ["Retreat add ons", <CreditCardRounded />],
}

let sidenavAccountItems = {
  support: ["Support", <ForumRounded />],
  logOut: ["Log out", <ExitToAppRounded />],
}

let items = {...sidenavItems, ...sidenavAccountItems}

type SidenavItemType = keyof typeof items
type PageSidenavProps = {
  activeItem?: SidenavItemType
}
export default function PageSidenav(
  props: PropsWithChildren<PageSidenavProps>
) {
  const classes = useStyles()
  let [closed, setClosed] = useState(false)
  let dispatch = useDispatch()
  let userName = useSelector(UserGetters.getUserName)
  let userCompany = useSelector(CompanyGetters.getCompany)

  function SidenavListItem(props: {
    itemType: SidenavItemType
    activeItem?: SidenavItemType
  }) {
    let {itemType, activeItem} = {...props}
    let selected = itemType === activeItem
    let disabled = !["onboarding", "logOut", "support"].includes(itemType)
    let onClick = () => {
      if (!selected) {
        switch (itemType) {
          case "onboarding":
            dispatch(push(AppRoutes.getPath("HomePage")))
            break
          case "logOut":
            dispatch(deleteUserSignin())
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
      <List className={classes.root}>
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
      <List className={classes.root}>
        {Object.keys(sidenavAccountItems).map((item, i) => {
          return (
            <SidenavListItem
              itemType={item as SidenavItemType}
              activeItem={props.activeItem}
              key={i}
            />
          )
        })}

        {userName ? (
          <>
            <Box
              paddingTop={1}
              paddingBottom={1}
              width={"80%"}
              marginLeft="auto"
              marginRight="auto">
              <Divider />
            </Box>
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
          </>
        ) : undefined}
      </List>
    )
  }

  function DrawerBody(props: {logoSize?: "small" | "large"}) {
    return (
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        justifyContent="space-between">
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
        <Drawer className={classes.root} variant="permanent">
          <DrawerBody logoSize="large" />
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        <PageNav onMenuClick={() => setClosed(false)} />
      </Hidden>

      <Hidden mdUp>
        <Drawer
          className={classes.root}
          variant="temporary"
          open={!closed}
          onClose={() => setClosed(true)}>
          <DrawerBody logoSize="small" />
        </Drawer>
      </Hidden>
    </>
  )
}
