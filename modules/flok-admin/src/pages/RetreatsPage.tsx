import {makeStyles, Tab, Tabs, Typography} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBase from "../components/page/PageBase"
import RetreatsTable, {
  RetreatsTableRow,
} from "../components/retreats/RetreatsTable"
import {AdminRetreatListModel, AdminRetreatListType} from "../models"
import {enqueueSnackbar} from "../notistack-lib/actions"
import {RootState} from "../store"
import {getRetreatsList} from "../store/actions/admin"

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

type RetreatsPageProps = RouteComponentProps<{}>

function RetreatsPage(props: RetreatsPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let [retreatsType, setRetreatsType] = useState<AdminRetreatListType>("active")

  function transformToRows(retreats: AdminRetreatListModel[]): {
    [id: number]: RetreatsTableRow
  } {
    let rowsDict: {
      [id: number]: RetreatsTableRow
    } = {}
    retreats.forEach((retreat) => {
      rowsDict[retreat.id] = {
        id: retreat.id,
        guid: retreat.guid,
        companyName: retreat.company_name,
        contactEmail: retreat.contact_email,
        numAttendees: retreat.preferences_num_attendees_lower,
        flokOwner: retreat.flok_admin_owner,
        flokState: retreat.flok_admin_state,
        createdAt: retreat.created_at,
      }
    })
    return rowsDict
  }

  let activeRetreats = useSelector((state: RootState) => {
    return transformToRows(state.admin.retreatsList.active)
  })

  let inactiveRetreats = useSelector((state: RootState) => {
    return transformToRows(state.admin.retreatsList.inactive)
  })

  let completeRetreats = useSelector((state: RootState) => {
    return transformToRows(state.admin.retreatsList.complete)
  })

  useEffect(() => {
    dispatch(getRetreatsList(retreatsType))
  }, [retreatsType, dispatch])

  return (
    <PageBase>
      <div className={classes.body}>
        <Typography variant="h1">Retreats Page</Typography>
        <div className={classes.tabs}>
          <Tabs
            value={retreatsType}
            onChange={(e, val: AdminRetreatListType) => setRetreatsType(val)}
            variant="fullWidth"
            indicatorColor="primary">
            <Tab label="Active" id="active" value="active" />
            <Tab label="Inactive" id="inactive" value="inactive" />
            <Tab label="Complete" id="complete" value="complete" />
          </Tabs>
        </div>
        <div className={classes.table}>
          <RetreatsTable
            rows={Object.values(
              retreatsType === "active"
                ? activeRetreats
                : retreatsType === "inactive"
                ? inactiveRetreats
                : retreatsType === "complete"
                ? completeRetreats
                : {}
            )}
            onSelect={(id) =>
              dispatch(
                enqueueSnackbar({
                  message: `Sup ${id}`,
                  options: {variant: "error"},
                })
              )
            }
          />
        </div>
      </div>
    </PageBase>
  )
}

export default withRouter(RetreatsPage)
