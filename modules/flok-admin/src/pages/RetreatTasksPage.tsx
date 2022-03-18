import {Breadcrumbs, Link, makeStyles, Typography} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import AppTodoList from "../components/retreats/RetreatTaskList"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getRetreatDetails} from "../store/actions/admin"
import {useQuery} from "../utils"

let useStyles = makeStyles((theme) => ({
  body: {
    flex: "1 1 auto",
    width: "100%",
    minHeight: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  tabBody: {
    flex: "1 1 auto",
    minHeight: 0,
  },
}))

type RetreatTasksPageProps = RouteComponentProps<{
  retreatId: string
}>

function RetreatTasksPage(props: RetreatTasksPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreatId = parseInt(props.match.params.retreatId) || -1 // -1 for an id that will always return 404
  let [tabQuery, setTabQuery] = useQuery("tab")
  let [tabValue, setTabValue] = useState<string | undefined>(undefined)
  useEffect(() => {
    const TABS = ["notes", "intake"]
    setTabValue(tabQuery && TABS.includes(tabQuery) ? tabQuery : "intake")
  }, [tabQuery, setTabValue])

  // Get retreat data
  let retreat = useSelector((state: RootState) => {
    return state.admin.retreatsDetails[retreatId]
  })

  useEffect(() => {
    if (!retreat) {
      dispatch(getRetreatDetails(retreatId))
    }
  }, [retreat, dispatch, retreatId])

  return (
    <PageBase>
      <div className={classes.body}>
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
          <AppTypography color="textPrimary">Tasks</AppTypography>
        </Breadcrumbs>
        <Typography variant="h1">{retreat?.company_name} - Tasks</Typography>
        <AppTodoList
          retreatId={retreatId}
          retreatToTasks={(retreat?.tasks_completed ?? []).concat(
            retreat?.tasks_todo ?? []
          )}
          orderBadge={false}
          collapsed={false}
        />
      </div>
    </PageBase>
  )
}

export default withRouter(RetreatTasksPage)
