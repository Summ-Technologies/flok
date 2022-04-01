import {Breadcrumbs, Link, makeStyles, Tab, Tabs} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTabPanel from "../components/base/AppTabPanel"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import RetreatNotes from "../components/retreats/RetreatNotes"
import RetreatSalesIntakeForm from "../components/retreats/RetreatSalesIntakeForm"
import RetreatStateTitle from "../components/retreats/RetreatStateTitle"
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
  pageTitle: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabBody: {
    flex: "1 1 auto",
    minHeight: 0,
  },
}))

type RetreatSalesIntakePageProps = RouteComponentProps<{
  retreatId: string
}>

function RetreatSalesIntakePage(props: RetreatSalesIntakePageProps) {
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
          <AppTypography color="textPrimary">Sales Intake</AppTypography>
        </Breadcrumbs>

        {retreat && <RetreatStateTitle retreat={retreat} type="intake" />}
        {retreat && (
          <>
            <Tabs
              value={tabValue}
              onChange={(e, newVal) =>
                setTabQuery(newVal === "intake" ? null : newVal)
              }
              variant="fullWidth"
              indicatorColor="primary">
              <Tab value="intake" label="Intake form" />
              <Tab value="notes" label="Sales notes" />
            </Tabs>
            <AppTabPanel
              show={tabValue === "intake"}
              className={classes.tabBody}>
              <RetreatSalesIntakeForm retreat={retreat} />
            </AppTabPanel>
            <AppTabPanel
              show={tabValue === "notes"}
              className={classes.tabBody}>
              <RetreatNotes retreatId={retreat.id} />
            </AppTabPanel>
          </>
        )}
      </div>
    </PageBase>
  )
}

export default withRouter(RetreatSalesIntakePage)
