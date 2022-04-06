import {Box, Button, makeStyles, Tooltip, Typography} from "@material-ui/core"
import LockIcon from "@material-ui/icons/Lock"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppMoreInfoIcon from "../components/base/AppMoreInfoIcon"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageLockedModal from "../components/page/PageLockedModal"
import PageSidenav from "../components/page/PageSidenav"
import {useRetreat} from "./misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    flex: 1,
    overflow: "hidden",
  },
  itineraryContainer: {
    display: "flex",
    flex: 1,
    maxWidth: 680,
    overflow: "auto",
    backgroundColor: theme.palette.common.white,
  },
  draftHeading: {
    fontWeight: 700,
  },
  draftBox: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  linkButton: {
    width: "fit-content",
    marginTop: theme.spacing(2),
    "&:hover": {
      textDecoration: "none",
    },
    "&.Mui-disabled.MuiButton-root": {
      pointerEvents: "auto",
    },
  },
  lockIcon: {
    marginTop: "-5px",
  },
  link: {
    "&:hover": {
      textDecoration: "none",
    },
    textDecoration: "none",
  },
  linksDiv: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  buttonWrapper: {
    width: "fit-content",
  },
}))

type RetreatItineraryPageProps = RouteComponentProps<{retreatIdx: string}>
function RetreatItineraryPage(props: RetreatItineraryPageProps) {
  let classes = useStyles(props)
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()

  return (
    <PageContainer>
      <PageSidenav
        activeItem="itinerary"
        retreatIdx={retreatIdx}
        companyName={retreat.company_name}
      />
      <PageBody appBar>
        <div className={classes.root}>
          <Typography variant="h1">Itinerary</Typography>
          {retreat.itinerary_state !== "BOOKING" && (
            <PageLockedModal pageDesc="This page will be unlocked when we begin booking your itinerary" />
          )}

          <div className={classes.linksDiv}>
            <Box className={classes.draftBox}>
              <Typography variant="h4" className={classes.draftHeading}>
                Working Draft
                <AppMoreInfoIcon tooltipText="Your retreat designer will present an initial itinerary draft and then will iterate based on your feedback." />
              </Typography>
              <Tooltip
                title="This link will be added as soon as it's available"
                disableHoverListener={!!retreat.itinerary_first_draft_link}
                arrow>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.linkButton}
                  disabled={!retreat.itinerary_first_draft_link}
                  href={retreat.itinerary_first_draft_link}
                  size="large">
                  Working Draft
                </Button>
              </Tooltip>
            </Box>
            <Box className={classes.draftBox}>
              <Typography variant="h4" className={classes.draftHeading}>
                {!retreat.itinerary_final_draft_link && (
                  <LockIcon fontSize="small" className={classes.lockIcon} />
                )}
                Final Draft
                <AppMoreInfoIcon tooltipText="Your retreat designer will create a final itinerary using Travefy. This itinerary can be shared with all of the attendees before your retreat! " />
              </Typography>
              <Tooltip
                title="This link will be added as soon as it's available"
                disableHoverListener={!!retreat.itinerary_final_draft_link}
                arrow>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.linkButton}
                  disabled={!retreat.itinerary_final_draft_link}
                  href={retreat.itinerary_final_draft_link}
                  size="large">
                  Final Draft
                </Button>
              </Tooltip>
            </Box>
          </div>
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatItineraryPage)
