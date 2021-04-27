import {Box, Drawer, Hidden, List, ListItem, Tooltip} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import {
  AddRounded,
  ClearRounded,
  CreditCardRounded,
  FlightRounded,
  HomeRounded,
  LockOutlined,
  PersonRounded,
} from "@material-ui/icons"
import {push} from "connected-react-router"
import React, {PropsWithChildren, useState} from "react"
import {useDispatch} from "react-redux"
import {AppRoutes} from "../../Stack"

let DRAWER_WIDTH = 240

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.appBar - 1,
    [theme.breakpoints.up("md")]: {
      width: DRAWER_WIDTH,
    },
  },
  toolbar: {...theme.mixins.toolbar},
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
type SidenavItemType = keyof typeof sidenavItems
type PageSidenavProps = {
  activeItem?: SidenavItemType
}
export default function PageSidenav(
  props: PropsWithChildren<PageSidenavProps>
) {
  const classes = useStyles()
  let [closed, setClosed] = useState(false)
  let dispatch = useDispatch()

  function sidenavListItem(itemType: SidenavItemType) {
    let selected = itemType === props.activeItem
    let disabled = itemType !== "onboarding"
    let onClick = () => {
      if (!selected) {
        switch (itemType) {
          case "onboarding":
            dispatch(push(AppRoutes.getPath("HomePage")))
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
        key={itemType[0]}>
        <Box marginRight={1}>{sidenavItems[itemType][1]}</Box>
        {sidenavItems[itemType][0]}
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

  function sidenavList() {
    return (
      <List className={classes.root}>
        {Object.keys(sidenavItems).map((item) => {
          return sidenavListItem(item as SidenavItemType)
        })}
      </List>
    )
  }

  return (
    <>
      <Hidden smDown>
        <Drawer className={classes.root} variant="permanent">
          <div className={classes.toolbar}></div>
          <ClearRounded style={{opacity: 0}} />
          {sidenavList()}
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        <Drawer className={classes.root} variant="temporary" open={!closed}>
          <div className={classes.toolbar}></div>
          <ClearRounded onClick={() => setClosed(true)} />
          {sidenavList()}
        </Drawer>
      </Hidden>
    </>
  )
}
