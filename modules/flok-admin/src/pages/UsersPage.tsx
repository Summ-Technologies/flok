import {Breadcrumbs, Link, makeStyles} from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import UsersTable from "../components/users/UsersTable"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getRetreatDetails} from "../store/actions/admin"

let useStyles = makeStyles((theme) => ({
  body: {
    flex: "1 1 auto",
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  tabs: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  table: {
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

type UsersPageProps = RouteComponentProps<{retreatId?: string}>

function UsersPage(props: UsersPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let retreatId = props.match.params.retreatId
    ? parseInt(props.match.params.retreatId)
    : -1

  let retreat = useSelector((state: RootState) =>
    retreatId === -1
      ? {company_name: ""}
      : state.admin.retreatsDetails[retreatId]
  )
  useEffect(() => {
    if (retreatId !== -1 && retreat === undefined) {
      dispatch(getRetreatDetails(retreatId))
    }
  })

  return (
    <PageBase>
      <div className={classes.body}>
        {retreatId !== -1 && (
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              color="inherit"
              to={AppRoutes.getPath("RetreatsPage")}
              component={ReactRouterLink}>
              All Retreats
            </Link>
            <Link
              color="inherit"
              to={AppRoutes.getPath("RetreatPage", {
                retreatId: retreatId.toString(),
              })}
              component={ReactRouterLink}>
              {retreat?.company_name}
            </Link>
            <AppTypography color="textPrimary">Users</AppTypography>
          </Breadcrumbs>
        )}
        <Typography variant="h1">Users Page</Typography>
        <UsersTable retreatId={retreatId} />
      </div>
    </PageBase>
  )
}

export default withRouter(UsersPage)
