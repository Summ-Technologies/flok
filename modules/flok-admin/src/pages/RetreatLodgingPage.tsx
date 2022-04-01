import {Breadcrumbs, Link, makeStyles} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import RetreatLodgingDetails from "../components/retreats/RetreatLodgingDetails"
import RetreatStateTitle from "../components/retreats/RetreatStateTitle"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getRetreatDetails} from "../store/actions/admin"

let useStyles = makeStyles((theme) => ({
  body: {
    flex: "1 1 auto",
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
}))

type RetreatLodgingPageProps = RouteComponentProps<{
  retreatId: string
}>

function RetreatLodgingPage(props: RetreatLodgingPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreatId = parseInt(props.match.params.retreatId) || -1 // -1 for an id that will always return 404

  // Get retreat data
  let retreat = useSelector((state: RootState) => {
    return state.admin.retreatsDetails[retreatId]
  })

  useEffect(() => {
    if (!retreat) {
      dispatch(getRetreatDetails(retreatId))
    }
  }, [retreat, dispatch, retreatId])

  let [delayLoad, setDelayLoad] = useState(true)
  useEffect(() => {
    if (delayLoad) {
      setDelayLoad(false)
    }
  }, [delayLoad])
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
          <AppTypography color="textPrimary">Lodging</AppTypography>
        </Breadcrumbs>
        {retreat && <RetreatStateTitle retreat={retreat} type="lodging" />}{" "}
        {retreat && !delayLoad && <RetreatLodgingDetails retreat={retreat} />}
      </div>
    </PageBase>
  )
}

export default withRouter(RetreatLodgingPage)
