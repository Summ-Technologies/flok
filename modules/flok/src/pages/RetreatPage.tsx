import {Box, Grid, Hidden, makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/PageBody"
import RetreatEmployeeOnboarding from "../components/RetreatEmployeeOnboarding"
import RetreatTimeline from "../components/RetreatTimeline"

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100%",
  },
  sidebar: {
    minHeight: "100%",
  },
  body: {
    minHeight: "100%",
  },
}))

type RetreatPageProps = RouteComponentProps<{}>
function RetreatPage(props: RetreatPageProps) {
  const classes = useStyles()
  return (
    <PageBody fullWidth>
      <Grid item container spacing={4} className={classes.container}>
        <Hidden xsDown>
          <Grid item sm={5} md={4} lg={3} className={classes.sidebar}>
            <RetreatTimeline />
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={7} md={8} lg={9} className={classes.body}>
          <Box paddingTop={4} height="100%">
            {/* <RetreatOnboardingCall /> */}
            <RetreatEmployeeOnboarding />
          </Box>
        </Grid>
      </Grid>
    </PageBody>
  )
}
export default withRouter(RetreatPage)
