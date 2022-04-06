import {Link, makeStyles, Typography} from "@material-ui/core"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import PageBase from "../components/page/PageBase"
import {AppRoutes} from "../Stack"

let useStyles = makeStyles((theme) => ({
  body: {
    flex: 1,
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}))

type HomePageProps = RouteComponentProps<{}>

function HomePage(props: HomePageProps) {
  let classes = useStyles(props)
  return (
    <PageBase>
      <div className={classes.body}>
        <Typography variant="h1">
          Welcome to the Flok admin dashboard.
        </Typography>
        <Typography variant="h3">Quick links:</Typography>
        <ul>
          <Typography variant="body1" component="li">
            <Link
              component={ReactRouterLink}
              to={AppRoutes.getPath("RetreatsPage")}>
              All retreats
            </Link>
          </Typography>
          <Typography variant="body1" component="li">
            <Link
              component={ReactRouterLink}
              to={AppRoutes.getPath("HotelsPage")}>
              Hotel content & lodging proposals database
            </Link>
          </Typography>
          <Typography variant="body1" component="li">
            <Link
              component={ReactRouterLink}
              to={AppRoutes.getPath("AllUsersPage")}>
              All Users
            </Link>
          </Typography>
        </ul>
      </div>
    </PageBase>
  )
}

export default withRouter(HomePage)
