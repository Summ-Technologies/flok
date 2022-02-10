import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  styled,
  TextField,
  Tooltip,
} from "@material-ui/core"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppExpandableTable from "../components/base/AppExpandableTable"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import UnderConstructionView from "../components/page/UnderConstructionView"
import {RetreatModel} from "../models/retreat"
import {
  deleteRetreatAttendees,
  postRetreatAttendees,
} from "../store/actions/retreat"
import {theme} from "../theme"
import {convertGuid} from "../utils"
import {useRetreat, useRetreatAttendees} from "../utils/lodgingUtils"

const UNDER_CONSTRUCTION = false

const HtmlTooltip = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  ["& .MuiTooltip-tooltip"]: {
    backgroundColor: theme.palette.background.default,
    border: "1px solid #dadde9",
  },
}))

function DietList(prefString: string | undefined) {
  if (!prefString) {
    return <></>
  }
  const prefs = prefString.split(",").map((s) => (
    <Chip
      size="small"
      label={s}
      style={{
        margin: "1px 2px",
        backgroundColor: theme.palette.primary.main,
        color: "white",
        cursor: "pointer",
      }}
    />
  ))
  if (prefs.length > 1) {
    return (
      <HtmlTooltip placement="bottom" title={<>{prefs}</>}>
        <div style={{display: "flex", alignItems: "flex-end"}}>
          {prefs.slice(0, 2)}...
        </div>
      </HtmlTooltip>
    )
  }
  return prefs[0]
}

let useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
    "& > *:not(:first-child)": {
      paddingLeft: theme.spacing(1),
    },
  },
  headerIcon: {
    marginRight: theme.spacing(1),
    verticalAlign: "top",
    "&.todo": {
      color: theme.palette.error.main,
    },
    "&.next": {
      color: theme.palette.warning.main,
    },
    "&.completed": {
      color: theme.palette.success.main,
    },
  },
  addBtn: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
}))

function currencyFormat(num: Number) {
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function dateFormat(date: Date | undefined) {
  if (date === undefined) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

type RetreatAttendeesProps = RouteComponentProps<{retreatGuid: string}>
function RetreatAttendeesPage(props: RetreatAttendeesProps) {
  let classes = useStyles()

  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useRetreat(retreatGuid) as RetreatModel | undefined

  let attendeeTravelInfo = useRetreatAttendees(retreatGuid)
  console.log(attendeeTravelInfo)

  let [addDialogOpen, setAddDialogOpen] = useState(false)
  let [newAttendeeName, setNewAttendeeName] = useState("")
  let [newAttendeeEmail, setNewAttendeeEmail] = useState("")
  let [newAttendeeErrorState, setNewAttendeeErrorState] = useState({
    name: false,
    email: false,
  })

  let dispatch = useDispatch()

  const handleNewAttendeeSubmit = () => {
    const errorState = {name: false, email: false}
    if (newAttendeeName === "") {
      errorState.name = true
      setNewAttendeeName("")
    }
    if (
      newAttendeeEmail === "" ||
      !newAttendeeEmail.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errorState.email = true
      setNewAttendeeEmail("")
    }

    if (!errorState.name && !errorState.email) {
      dispatch(
        postRetreatAttendees(retreatGuid, newAttendeeName, newAttendeeEmail)
      )
      setNewAttendeeEmail("")
      setNewAttendeeName("")
      setAddDialogOpen(false)
    }

    setNewAttendeeErrorState(errorState)
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageSidenav
          activeItem="attendees"
          retreatGuid={retreatGuid}
          companyName={retreat?.company_name}
        />
        <PageBody>
          {UNDER_CONSTRUCTION ? (
            <UnderConstructionView />
          ) : (
            <div className={classes.section}>
              <AppTypography variant="h1" paragraph>
                Attendees
              </AppTypography>
              <AppExpandableTable
                headers={[
                  {
                    name: "Employee",
                    comparator: (r1, r2) =>
                      r1[0].toString().localeCompare(r2[0].toString()),
                  },
                  {name: "Email"},
                  {name: "Employee City"},
                  {name: "Dietary Preferences"},
                  {
                    name: "Other notes",
                  },
                ]}
                rows={
                  attendeeTravelInfo !== "RESOURCE_NOT_FOUND" &&
                  attendeeTravelInfo !== undefined
                    ? attendeeTravelInfo.map((info) => ({
                        id: info.id,
                        disabled: !info.info_status.endsWith("INFO_ENTERED"),
                        tooltip: !info.info_status.endsWith("INFO_ENTERED")
                          ? "Once the attendee fills out the registration form you will be able to view more of their information here."
                          : "",
                        cols: [
                          info.name,
                          info.email_address,
                          info.city,
                          DietList(info.dietary_prefs),
                          info.notes,
                        ],
                      }))
                    : []
                }
                rowDeleteCallback={(row) => {
                  dispatch(deleteRetreatAttendees(retreatGuid, row.id))
                }}
              />
              <div className={classes.addBtn}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setAddDialogOpen(true)}>
                  Add Attendee
                </Button>
              </div>
            </div>
          )}
          <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
            <DialogTitle>Add New Attendee</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To add a new attendee to your retreat please enter their full
                name and email address below. We'll reach out to them to confirm
                and fill in some of their information and when they have
                confirmed their name will be added here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Full Name"
                value={newAttendeeName}
                error={newAttendeeErrorState.name}
                onChange={(e) => setNewAttendeeName(e.target.value)}
                fullWidth
                variant="standard"
                required
              />
              <TextField
                margin="dense"
                id="email"
                label="Email Address"
                value={newAttendeeEmail}
                error={newAttendeeErrorState.email}
                onChange={(e) => setNewAttendeeEmail(e.target.value)}
                type="email"
                fullWidth
                variant="standard"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewAttendeeSubmit}>
                Submit
              </Button>
              <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </PageBody>
      </PageContainer>
    </RetreatRequired>
  )
}

export default withRouter(RetreatAttendeesPage)
