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
    justifyContent: "space-between",
    padding: "20px",
    alignItems: "normal",
    width: "90%",
  },
  navigationLink: {
    padding: theme.spacing(2),
    lineHeight: "48px",
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
}))

function RetreatWebsiteHeader(props: RetreatWebsiteHeaderProps) {
  let classes = useStyles()
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className={classes.header}>
      <img src={props.logo} className={classes.logo} alt="logo"></img>
      {!isSmallScreen ? (
        <>
          <div>
            {props.pages.map((page) => {
              return (
                <Link
                  href={`/retreats/${props.retreatName}/${page}`}
                  className={classes.navigationLink}
                  style={
                    page === props.selectedPage
                      ? {
                          paddingBottom: "4px",
                          borderBottomStyle: "solid",
                          borderBottomWidth: "3.1px",
                        }
                      : {}
                  }>
                  {page}
                </Link>
              )
            })}
          </div>
          <Button color="primary" variant="contained">
            Register Now
          </Button>
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
                          paddingBottom: "4px",
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
