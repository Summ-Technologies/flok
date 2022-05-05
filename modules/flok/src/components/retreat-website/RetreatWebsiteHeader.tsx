import {
  Button,
  Drawer,
  Link,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core"
import {useState} from "react"
import {FlokTheme} from "../../theme"

type RetreatWebsiteHeaderProps = {
  logo: string
  pages: string[]
  retreatName: string
  selectedPage: string
}
let useStyles = makeStyles((theme) => ({
  logo: {
    height: "50px",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    alignItems: "normal",
    width: "90%",
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
    },
  },
  drawer: {
    width: "100%",
  },
  imgWrapper: {
    width: "33%",
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
  },
}))

let testPages = [
  "Home",
  "FAQ",
  "Resort Info",
  "Travel Info",
  "Itinerary",
  "Code of Conduct",
  "Passport/Visa",
]

function RetreatWebsiteHeader(props: RetreatWebsiteHeaderProps) {
  let classes = useStyles()
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className={classes.header}>
      <div className={classes.imgWrapper}>
        <img src={props.logo} className={classes.logo} alt="logo"></img>
      </div>

      {!isSmallScreen ? (
        <>
          <div className={classes.navLinkContainer}>
            {testPages.map((page) => {
              return (
                <Link
                  href={`/retreats/${props.retreatName}/${page}`}
                  className={classes.navigationLink}
                  style={
                    page === props.selectedPage
                      ? {
                          textDecoration: "underline",
                          // paddingBottom: "4px",
                          // borderBottomStyle: "solid",
                          // borderBottomWidth: "3.1px",
                          // height: "1.2 rem",
                        }
                      : {}
                  }>
                  {page}
                </Link>
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
          <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
          <Drawer
            anchor={"right"}
            open={drawerOpen}
            onClose={() => {
              setDrawerOpen(false)
            }}
            className={classes.drawer}>
            {props.pages.map((page) => {
              return (
                <Link
                  href={`/retreats/${props.retreatName}/${page}`}
                  className={classes.navigationLink}
                  style={
                    page === props.selectedPage
                      ? {
                          // paddingBottom: "4px",
                          height: "1 rem",
                          borderBottomStyle: "solid",
                          borderBottomWidth: "3.1px",
                        }
                      : {}
                  }>
                  {page}
                </Link>
              )
            })}
            <Button color="primary" variant="contained">
              Register Now
            </Button>
          </Drawer>
        </>
      )}
    </div>
  )
}
export default RetreatWebsiteHeader
