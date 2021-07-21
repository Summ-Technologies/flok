import {
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  makeStyles,
} from "@material-ui/core"
import {KeyboardArrowLeftOutlined} from "@material-ui/icons"
import React from "react"
import {Link as ReactRouterLink} from "react-router-dom"
import {AppRoutes} from "../../Stack"
import AppImage from "../base/AppImage"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {},
  back: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {},
  titleLink: {
    marginLeft: theme.spacing(1),
  },
  subheader: {},
  headerDivider: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  footerCtaContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  body: {
    marginTop: theme.spacing(4),
  },

  paperRoot: {
    padding: theme.spacing(4),
  },

  rowRoot: {
    display: "flex",
    alignItems: "center",
    height: 240,
    marginBottom: theme.spacing(4),
    width: "100%",
  },
  img: {
    height: "100%",
  },
  rowTitle: {
    marginLeft: theme.spacing(2),
  },
  menuBtn: {
    marginLeft: theme.spacing(1),
  },
  cta: {
    marginLeft: "auto",
  },
  rowBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
}))

type AppLodgingConfirmationProps = {}
export default function AppLodgingConfirmation(
  props: AppLodgingConfirmationProps
) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <MuiLink
        className={classes.back}
        to={AppRoutes.getPath("LodgingProposalPage")}
        component={ReactRouterLink}
        variant="body2"
        color="textSecondary">
        <KeyboardArrowLeftOutlined />
        Back to proposal
      </MuiLink>

      <Card className={classes.paperRoot}>
        <AppTypography variant="h4">You selected</AppTypography>
        <CardContent className={classes.rowRoot}>
          <AppImage
            className={classes.img}
            {...{
              img: `https://picsum.photos/400/300?x=${Math.random()}`,
              alt: "Camp Navarro",
            }}
          />
          <div className={classes.rowTitle}>
            <AppTypography variant="h3">Camp Navarro</AppTypography>
            <AppTypography variant="body1">
              $125 / night / person{" "}
            </AppTypography>
          </div>
          <div style={{marginLeft: "auto"}}>
            <Button color="primary" className={classes.cta}>
              Upload contract to confirm
            </Button>
            <Button color="primary" variant="contained" className={classes.cta}>
              Confirm without uploading
            </Button>
          </div>
        </CardContent>
        <div className={classes.body}>
          <div className={classes.footerCtaContainer}>
            <div>
              <AppTypography style={{paddingBottom: 4}} variant="h4">
                Great choice!
              </AppTypography>
              <AppTypography variant="body1">
                Don't forget to upload your signed contract.{" "}
              </AppTypography>
              <AppTypography variant="body1">
                This allows us to better coordinate flights and itinerary
              </AppTypography>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
