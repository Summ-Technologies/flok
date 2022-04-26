import {
  Box,
  Collapse,
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
import {push} from "connected-react-router"
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import {useDispatch, useSelector} from "react-redux"
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
    paddingTop: theme.spacing(3),
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
  icon: SvgIconComponent
  pageName?: FlokPageName
  subTabs?: {title: string; pageName: FlokPageName}[]
}

const navItems = {
  overview: {
    title: "Overview",
    icon: HomeRounded,
    pageName: "RetreatHomePage",
  },
  lodging: {
    title: "Lodging",
    icon: ApartmentRounded,
    pageName: "RetreatHomePage",
  },
  attendees: {
    title: "Attendees",
    icon: PeopleAlt,
    pageName: "RetreatAttendeesPage",
  },
  flights: {
    title: "Flights",
    icon: FlightRounded,
    pageName: "RetreatFlightsPage",
  },
  // itinerary: navItem("Itinerary", MapRounded, "RetreatItineraryPage"),
} as {[key: string]: NavItem}

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

type SidenavItemType = keyof typeof navItems
type PageSidenavProps = {
  retreatIdx: number
  activeItem?: SidenavItemType
  activeSubTabIndex?: number
}
export default function PageSidenav(props: PageSidenavProps) {
  let dispatch = useDispatch()
  const classes = useStyles()
  let user = useSelector((state: RootState) => state.user.user)
  let {sidebarOpen, closeSidebar} = useSidebar()
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )
  let retreatModel = useRetreat()

  let isLoggedIn = useSelector(
    (state: RootState) => state.user.loginStatus === "LOGGED_IN"
  )

  let [retreat, setRetreat] = useState<
    Pick<RetreatModel, "company_name" | "id"> | undefined
  >(undefined)
  useEffect(() => {
    if (user && user.retreats.length > props.retreatIdx) {
      setRetreat(user.retreats[props.retreatIdx])
    }
  }, [props.retreatIdx, user])

  function getLinkSidenavProps(link?: string): any {
    if (link) {
      return {
        button: true,
        href: link,
        component: "a",
        target: "_blank",
      }
    } else {
      return {
        button: true,
        disabled: true,
      }
    }
  }

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
        {Object.keys(navItems).map((itemName, index) => {
          let sidenavItemName = itemName as SidenavItemType
          const item = navItems[sidenavItemName]
          return (
            <>
              <ListItem
                key={index}
                button
                selected={
                  props.activeItem === sidenavItemName && !!!item.subTabs
                }
                onClick={() => {
                  let redirect = () =>
                    item.pageName &&
                    dispatch(
                      push(
                        AppRoutes.getPath(item.pageName, {
                          retreatIdx: props.retreatIdx.toString(),
                        })
                      )
                    )
                  if (sidebarOpen) {
                    closeSidebar()
                    setTimeout(redirect, TRANSITION_DURATION)
                  } else {
                    redirect()
                  }
                }}>
                <ListItemIcon>{<item.icon fontSize="large" />}</ListItemIcon>
                <ListItemText>{item.title}</ListItemText>
              </ListItem>
              {item.subTabs && item.subTabs.length > 0 && (
                <Collapse
                  in={props.activeItem === sidenavItemName}
                  timeout="auto"
                  unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subTabs.map((subItem, subIdx) => (
                      <ListItem
                        key={subIdx}
                        button
                        selected={
                          props.activeItem === sidenavItemName &&
                          (props.activeSubTabIndex ?? 0) === subIdx
                        }
                        onClick={() => {
                          let redirect = () =>
                            subItem.pageName &&
                            dispatch(
                              push(
                                AppRoutes.getPath(subItem.pageName, {
                                  retreatIdx: props.retreatIdx.toString(),
                                })
                              )
                            )
                          if (sidebarOpen) {
                            closeSidebar()
                            setTimeout(redirect, TRANSITION_DURATION)
                          } else {
                            redirect()
                          }
                        }}>
                        <ListItemIcon></ListItemIcon>
                        <ListItemText>{subItem.title}</ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </>
          )
        })}
        <ListItem
          {...(retreatModel.itinerary_state === "IN_PROGRESS"
            ? getLinkSidenavProps(retreatModel.itinerary_final_draft_link)
            : getLinkSidenavProps())}>
          <ListItemIcon>
            <MapRounded fontSize="large" />
          </ListItemIcon>
          <ListItemText>Itinerary</ListItemText>
        </ListItem>
        <ListItem {...getLinkSidenavProps(retreatModel.faq_link)}>
          <ListItemIcon>
            <LocalAtm fontSize="large" />
          </ListItemIcon>
          <ListItemText>Budget</ListItemText>
        </ListItem>
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
              value={props.retreatIdx}
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
