import {Box, Grid, Hidden, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/PageBody"
import RetreatEmployeeOnboarding from "../components/retreats/RetreatEmployeeOnboarding"
import RetreatInitialProposals from "../components/retreats/RetreatInitialProposals"
import RetreatOnboardingCall from "../components/retreats/RetreatOnboardingCall"
import RetreatPayment from "../components/retreats/RetreatPayment"
import RetreatTimeline from "../components/retreats/RetreatTimeline"
import {RetreatEmployeeLocationItem} from "../models/retreat"
import {AppRoutes} from "../Stack"
import {postEmployeeLocationV2} from "../store/actions/retreat"
import RetreatGetters from "../store/getters/retreat"

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    maxHeight: "100%",
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  sidebar: {
    maxHeight: "100%",
    width: 250,
    minWidth: 250,
  },
  body: {
    height: "100%",
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
    overflow: "auto",
  },
}))

type RetreatPageProps = RouteComponentProps<{
  item?: string
}>
function RetreatPage(props: RetreatPageProps) {
  const classes = useStyles()
  let dispatch = useDispatch()
  let userRetreat = useSelector(RetreatGetters.getRetreat)
  let currentRetreatToItem = useSelector(RetreatGetters.getInProgressItem)

  function postRetreatEmployeeLocation(
    employeeLocations: RetreatEmployeeLocationItem[],
    extraInfo?: string
  ) {
    if (userRetreat) {
      dispatch(
        postEmployeeLocationV2(userRetreat.id, {
          retreatId: userRetreat.id,
          locationItems: employeeLocations,
          extraInfo: extraInfo,
        })
      )
    }
  }

  return userRetreat ? (
    <PageBody fullWidth>
      <Grid item container className={classes.container}>
        <Hidden smDown>
          <Grid item className={classes.sidebar}>
            <RetreatTimeline retreatItems={userRetreat.retreatItems} />
          </Grid>
        </Hidden>
        <Grid item className={classes.body}>
          <Box height="100%" width="100%">
            {currentRetreatToItem ? (
              currentRetreatToItem.retreatItem.type === "INTAKE_CALL" ? (
                <RetreatOnboardingCall />
              ) : currentRetreatToItem.retreatItem.type ===
                "EMPLOYEE_LOCATIONS" ? (
                <RetreatEmployeeOnboarding
                  postEmployeeLocations={postRetreatEmployeeLocation}
                />
              ) : currentRetreatToItem.retreatItem.type ===
                "INITIAL_PROPOSALS" ? (
                <RetreatInitialProposals
                  postEmployeeLocations={postRetreatEmployeeLocation}
                />
              ) : currentRetreatToItem.retreatItem.type ===
                "DESTINATION_SELECTION" ? (
                <RetreatPayment />
              ) : currentRetreatToItem.retreatItem.type === "POST_PAYMENT" ? (
                <>You paid sucker</>
              ) : undefined
            ) : undefined}
          </Box>
        </Grid>
      </Grid>
    </PageBody>
  ) : (
    <>{dispatch(push(AppRoutes.getPath("HomePage")))}</>
  )
}
export default withRouter(RetreatPage)
