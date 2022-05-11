import {
  Button,
  Drawer,
  IconButton,
  Link,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core"
import {Menu} from "@material-ui/icons"
import {useState} from "react"
import {FlokTheme} from "../../theme"
import {useAttendeeLandingPage} from "../../utils/retreatUtils"

let useStyles = makeStyles((theme) => ({
  logo: {
    height: "50px",
    [theme.breakpoints.down("sm")]: {
      width: "120px",
      height: "auto",
    },
  },
  header: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    alignItems: "normal",
    width: "90%",
    [theme.breakpoints.down("sm")]: {
      alignItems: "center",
      justifyContent: "space-between",
    },
  },
  navigationLink: {
    paddingRight: theme.spacing(2),
    lineHeight: "25px",
    color: theme.palette.grey[900],
    "&:hover": {
      textDecoration: "none",
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 200,
      height: "45px",
      fontSize: "130%",
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.spacing(2),
    },
  },
  drawer: {
    width: "100%",
  },
  imgWrapper: {
    width: "33%",
    [theme.breakpoints.down("sm")]: {
      width: "10",
    },
  },
  registerWrapper: {
    width: "33%",
    justifyContent: "center",
    display: "flex",
  },
  navLinkContainer: {
    width: "33%",
    overflowWrap: "break-word",
    justifyContent: "center",
    display: "inline-flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  registerButton: {
    maxHeight: 40,
    [theme.breakpoints.down("sm")]: {
      width: "70%",
      marginLeft: "15%",
    },
  },
  mobileNavLinkContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}))
type RetreatWebsiteHeaderProps = {
  logo: string
  pageIds: number[]
  retreatName: string
  selectedPage: string
  homeRoute: string
}

function RetreatWebsiteHeader(props: RetreatWebsiteHeaderProps) {
  let classes = useStyles()
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className={classes.header}>
      <div className={classes.imgWrapper}>
        <a href={props.homeRoute}>
          <img src={props.logo} className={classes.logo} alt="logo"></img>
        </a>
      </div>

      {!isSmallScreen ? (
        <>
          <div className={classes.navLinkContainer}>
            {props.pageIds.map((pageId) => {
              return (
                <RetreatWebsiteHeaderLink
                  retreatName={props.retreatName}
                  pageId={pageId}
                  selectedPage={props.selectedPage}
                />
              )
            })}
          </div>
          <div className={classes.registerWrapper}>
            <Button
              color="primary"
              variant="contained"
              size="small"
              className={classes.registerButton}>
              Register Now
            </Button>
          </div>
        </>
      ) : (
        <>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <Menu />
          </IconButton>
          <Drawer
            anchor={"right"}
            open={drawerOpen}
            onClose={() => {
              setDrawerOpen(false)
            }}
            className={classes.drawer}>
            <div className={classes.mobileNavLinkContainer}>
              {props.pageIds.map((pageId) => {
                return (
                  <RetreatWebsiteHeaderLink
                    retreatName={props.retreatName}
                    pageId={pageId}
                    selectedPage={props.selectedPage}
                  />
                )
              })}
            </div>
            <Button
              color="primary"
              variant="contained"
              className={classes.registerButton}>
              Register Now
            </Button>
          </Drawer>
        </>
      )}
    </div>
  )
}
export default RetreatWebsiteHeader

let useLinkStyles = makeStyles((theme) => ({
  navigationLink: {
    paddingRight: theme.spacing(2),
    lineHeight: "25px",
    color: theme.palette.grey[900],
    "&:hover": {
      textDecoration: "none",
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 200,
      height: "45px",
      fontSize: "130%",
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.spacing(2),
    },
  },
}))
type RetreatWebsiteHeaderLinkProps = {
  retreatName: string
  pageId: number
  selectedPage: string
}
function RetreatWebsiteHeaderLink(props: RetreatWebsiteHeaderLinkProps) {
  let classes = useLinkStyles()
  let page = useAttendeeLandingPage(props.pageId)
  function titleToNavigation(str: string) {
    let letters = str.split("")
    letters.forEach((letter, i) => {
      if (letter === " ") {
        letters[i] = "-"
      }
    })
    return letters.join("").toLowerCase()
  }
  return (
    <Link
      href={`/retreats/${titleToNavigation(
        props.retreatName
      )}/${titleToNavigation(page?.title ?? "home")}`}
      className={classes.navigationLink}
      style={
        page?.title === props.selectedPage
          ? {
              height: "1 rem",
              textDecoration: "underline",
            }
          : {}
      }>
      {page?.title}
    </Link>
  )
}
