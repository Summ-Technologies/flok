import {
  Button,
  Divider,
  IconButton,
  Link as MuiLink,
  makeStyles,
  Paper,
} from "@material-ui/core"
import {KeyboardArrowLeftOutlined, LinkRounded} from "@material-ui/icons"
import React from "react"
import {Document, Page} from "react-pdf/dist/esm/entry.webpack"
import {Link as ReactRouterLink} from "react-router-dom"
import {AppRoutes} from "../../Stack"
import AppHeader from "../base/AppHeader"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
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
  headerCta: {},
  body: {
    display: "flex",
    justifyContent: "center",
  },
}))

type AppLodgingProposalProps = {}
export default function AppLodgingProposal(props: AppLodgingProposalProps) {
  let classes = useStyles(props)
  return (
    <Paper className={classes.root}>
      <MuiLink
        className={classes.back}
        to={AppRoutes.getPath("LodgingPage")}
        component={ReactRouterLink}
        variant="body2"
        color="textSecondary">
        <KeyboardArrowLeftOutlined />
        Back to all proposals
      </MuiLink>
      <AppHeader
        header={
          <>
            The Ritz-Carlton
            <IconButton
              size="small"
              target={"__blank"}
              href={"https://hilton.com"}
              className={classes.titleLink}>
              <LinkRounded color="primary" />
            </IconButton>
          </>
        }
        subheader={
          "To move forward with this proposal please reach out to the Hotel Manager: Thomas Jefferson."
        }
        cta={
          <Button
            variant="outlined"
            color="primary"
            component={ReactRouterLink}
            to={AppRoutes.getPath("LodgingBookingPage", {id: "1"})}>
            Book now
          </Button>
        }
      />
      <Divider className={classes.headerDivider} />
      <div className={classes.body}>
        <Document file="https://flok-b32d43c.s3.us-east-1.amazonaws.com/lodging/proposal-test1.pdf">
          <Page pageNumber={1} />
        </Document>
      </div>
    </Paper>
  )
}
