import {
  Box,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@material-ui/core"
import {
  ApartmentRounded,
  FlightRounded,
  HomeRounded,
  LocalAtm,
  MapRounded,
  PeopleAlt,
  SvgIconComponent,
} from "@material-ui/icons"
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Link as ReactRouterLink, matchPath} from "react-router-dom"
import AppImage from "../../components/base/AppImage"
import {RetreatModel} from "../../models/retreat"
import {useRetreat} from "../../pages/misc/RetreatProvider"
import {AppRoutes, FlokPageName} from "../../Stack"
import {RootState} from "../../store"
import {deleteUserSignin} from "../../store/actions/user"
import {FlokTheme} from "../../theme"

let DRAWER_WIDTH = 240
const TRANSITION_DURATION = 250

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
  companySelector: {
    color: theme.palette.common.white,
    "& .MuiSelect-select:focus": {
      backgroundColor: "inherit",
    },
  },
}))

type NavItem = {
  title: string
  icon?: SvgIconComponent
  activeRoutes: FlokPageName[]
  redirect?: (
    retreat: RetreatModel,
    retreatIdx: number
  ) => {url: string; external?: boolean} | undefined
  navSubItems?: Exclude<NavItem, "navSubItems">[]
}

function redirectFlok(pageName: FlokPageName) {
  return (retreat: RetreatModel, retreatIdx: number) => ({
    url: AppRoutes.getPath(pageName, {retreatIdx: retreatIdx.toString()}),
  })
}

let navItems: NavItem[] = [
  {
    title: "Overview",
    icon: HomeRounded,
    activeRoutes: ["RetreatHomePage"],
    redirect: redirectFlok("RetreatHomePage"),
  },
  {
    title: "Lodging",
    icon: ApartmentRounded,
    activeRoutes: [],
    redirect: redirectFlok("RetreatLodgingPage"),
    navSubItems: [
      {
        title: "Proposals",
        activeRoutes: [
          "RetreatLodgingProposalsPage",
          "RetreatLodgingProposalPage",
        ],
        redirect: redirectFlok("RetreatLodgingProposalsPage"),
      },
      {
        title: "Contract",
        activeRoutes: ["RetreatLodgingContractPage"],
        redirect: redirectFlok("RetreatLodgingContractPage"),
      },
    ],
  },
  {
    title: "Attendees",
    icon: PeopleAlt,
    activeRoutes: ["RetreatAttendeesPage", "RetreatAttendeePage"],
    redirect: redirectFlok("RetreatAttendeesPage"),
  },
  {
    title: "Flights",
    icon: FlightRounded,
    activeRoutes: ["RetreatFlightsPage", "RetreatAttendeeFlightsPage"],
    redirect: redirectFlok("RetreatFlightsPage"),
  },
  {
    title: "Itinerary",
    icon: MapRounded,
    activeRoutes: [],
    redirect: (retreat) =>
      retreat.itinerary_final_draft_link
        ? {url: retreat.itinerary_final_draft_link, external: true}
        : undefined,
  },
  {
    title: "Budget",
    icon: LocalAtm,
    activeRoutes: ["RetreatBudgetPage"],
    redirect: redirectFlok("RetreatBudgetPage"),
    navSubItems: [
      {
        title: "Calculator",
        activeRoutes: ["RetreatBudgetEstimatePage"],
        redirect: redirectFlok("RetreatBudgetEstimatePage"),
      },
      {
        title: "Details",
        activeRoutes: [],
        redirect: (retreat) =>
          retreat.budget_link
            ? {url: retreat.budget_link, external: true}
            : undefined,
      },
    ],
  },
]

const SidebarContext = createContext<{
  sidebarOpen: boolean
  openSidebar: (() => void) | undefined
  closeSidebar: (() => void) | undefined
}>({sidebarOpen: false, openSidebar: undefined, closeSidebar: undefined})

export function useSidebar() {
  const {sidebarOpen, openSidebar, closeSidebar} = useContext(SidebarContext)
  if (openSidebar === undefined || closeSidebar === undefined) {
    throw Error("useSidebar must be used within a SidebarProvider")
  }
  return {sidebarOpen, openSidebar, closeSidebar}
}

export function SidebarProvider(props: PropsWithChildren<{}>) {
  let [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        openSidebar: () => setSidebarOpen(true),
        closeSidebar: () => setSidebarOpen(false),
      }}>
      {props.children}
    </SidebarContext.Provider>
  )
}

/**
 * PageSideav requires access to the useRetreat hook therefore needs to be rendered in a RetreatProvider.
 * PageSidenav also requires access to the user object, therefore needs to be rendered in a ProtectedRoute
 */
export default function PageSidenav() {
  let dispatch = useDispatch()
  const classes = useStyles()
  let [retreat, retreatIdx] = useRetreat()
  let user = useSelector((state: RootState) => state.user.user)
  let {sidebarOpen, closeSidebar} = useSidebar()
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )

  let isLoggedIn = useSelector(
    (state: RootState) => state.user.loginStatus === "LOGGED_IN"
  )

  return (
    <Drawer
      open={sidebarOpen}
      transitionDuration={TRANSITION_DURATION}
      onClose={closeSidebar}
      color="primary"
      classes={{root: classes.root, paper: classes.paper}}
      variant={isSmallScreen ? "temporary" : "permanent"}>
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
      </Box>
      <List>
        {navItems.map((navItem, i) => {
          let redirect = navItem.redirect
            ? navItem.redirect(retreat, retreatIdx)
            : undefined
          let activeRoutes = navItem.activeRoutes.filter((page) => {
            return matchPath(window.location.pathname, {
              path: AppRoutes.getPath(page),
              exact: true,
            })
          })
          let active = activeRoutes.length > 0
          let activeSubItem = false
          let subItems: JSX.Element[] = []
          if (navItem.navSubItems) {
            subItems = navItem.navSubItems.map((subItem, j) => {
              let subnavRedirect = subItem.redirect
                ? subItem.redirect(retreat, retreatIdx)
                : undefined
              let subItemActiveRoutes = subItem.activeRoutes.filter((page) => {
                return matchPath(window.location.pathname, {
                  path: AppRoutes.getPath(page),
                  exact: true,
                })
              })
              let subActive = subItemActiveRoutes.length > 0
              if (subActive) {
                activeSubItem = true
              }
              return (
                <NavListItem
                  key={`${i}-${j}`}
                  title={subItem.title}
                  redirect={subnavRedirect?.url}
                  externalLink={subnavRedirect?.external}
                  Icon={subItem.icon}
                  active={subActive}
                />
              )
            })
          }
          return (
            <>
              <NavListItem
                key={i}
                title={navItem.title}
                redirect={redirect?.url}
                externalLink={redirect?.external}
                Icon={navItem.icon}
                active={active}
              />
              {activeSubItem ? subItems : undefined}
            </>
          )
        })}
      </List>
      <List className={classes.footer}>
        {retreat && user && user.retreats.length > 1 ? (
          <ListItem button>
            <TextField
              onChange={(e) =>
                (window.location.href = AppRoutes.getPath("RetreatHomePage", {
                  retreatIdx: e.target.value,
                }))
              }
              fullWidth
              select
              SelectProps={{native: false, IconComponent: Box}}
              value={retreatIdx}
              InputProps={{
                disableUnderline: true,
                className: classes.companySelector,
              }}>
              {user?.retreats?.map((retreat, i) => (
                <MenuItem value={i} key={i}>
                  {retreat.company_name}
                </MenuItem>
              ))}
            </TextField>
          </ListItem>
        ) : retreat ? (
          <ListItem>
            <ListItemText>{retreat.company_name}</ListItemText>
          </ListItem>
        ) : undefined}
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
  )
}

type NavListItemType = {
  title: string
  Icon?: SvgIconComponent
  redirect?: string
  externalLink?: boolean
  active?: boolean
}
function NavListItem(props: NavListItemType) {
  let {sidebarOpen, closeSidebar} = useSidebar()
  let listItemProps = props.externalLink
    ? {
        component: "a",
        href: props.redirect,
        target: "_blank",
      }
    : {
        component: ReactRouterLink,
        to: props.redirect,
      }
  let disabled = !props.redirect
  return (
    <ListItem
      {...listItemProps}
      button
      selected={props.active}
      disabled={disabled}
      onClick={() => {
        if (sidebarOpen) closeSidebar()
      }}>
      <ListItemIcon>
        {props.Icon ? <props.Icon fontSize={"large"} /> : undefined}
      </ListItemIcon>
      <ListItemText>{props.title}</ListItemText>
    </ListItem>
  )
}
