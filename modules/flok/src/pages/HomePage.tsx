import {Box, Grid, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/PageBody"
import {AppRoutes} from "../Stack"
import RetreatGetters from "../store/getters/retreat"

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100%",
  },
  body: {
    minHeight: "100%",
  },
}))

type HomePageProps = RouteComponentProps<{}>
function HomePage(props: HomePageProps) {
  const classes = useStyles()
  let dispatch = useDispatch()
  let userRetreat = useSelector(RetreatGetters.getRetreat)
  return (
    <PageBody fullWidth>
      <Grid item container spacing={4} className={classes.container}>
        <Grid item xs={12} sm={7} md={8} lg={9} className={classes.body}>
          <Box margin={"auto"} height="100%">
            {userRetreat
              ? dispatch(push(AppRoutes.getPath("RetreatPage")))
              : "Looks like you need to setup a retreat!"}
          </Box>
        </Grid>
      </Grid>
    </PageBody>
  )
}
export default withRouter(HomePage)
