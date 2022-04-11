import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  makeStyles,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppExpandableTable from "../components/base/AppExpandableTable"
import AppTypography from "../components/base/AppTypography"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageLockedModal from "../components/page/PageLockedModal"
import PageSidenav from "../components/page/PageSidenav"
import {RetreatAttendeeModel, SampleLockedAttendees} from "../models/retreat"
import {
  deleteRetreatAttendees,
  postRetreatAttendees,
} from "../store/actions/retreat"
import {theme} from "../theme"
import {useRetreatAttendees} from "../utils/retreatUtils"
import {useRetreat} from "./misc/RetreatProvider"

const HtmlTooltip = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: theme.palette.background.default,
    border: "1px solid #dadde9",
  },
}))

function DietList(props: {prefString: string | undefined}) {
  if (!props.prefString) {
    return <></>
  }
  const prefs = props.prefString.split(",").map((s) => (
    <Chip
      key={s}
      size="small"
      label={s ? s[0].toLocaleUpperCase() + s.slice(1) : ""}
      style={{
        margin: "1px 2px",
        backgroundColor: theme.palette.primary.main,
        color: "white",
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
  notAttendingButton: {
    cursor: "pointer",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  table: {
    minWidth: "40vw",
  },
  notAttendingDialogBody: {
    padding: "0 !important",
    maxHeight: "30vh",
  },
  allAttendingP: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}))

type RetreatAttendeesProps = RouteComponentProps<{retreatIdx: string}>
function RetreatAttendeesPage(props: RetreatAttendeesProps) {
  let classes = useStyles()
  let dispatch = useDispatch()

  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()

  let [attendeeTravelInfo] = useRetreatAttendees(retreat.id)

  let [addDialogOpen, setAddDialogOpen] = useState(false)
  let [newAttendeeName, setNewAttendeeName] = useState("")
  let [newAttendeeEmail, setNewAttendeeEmail] = useState("")
  let [newAttendeeErrorState, setNewAttendeeErrorState] = useState({
    name: false,
    email: false,
  })

  if (retreat.attendees_state !== "REGISTRATION_OPEN") {
    attendeeTravelInfo = SampleLockedAttendees
  }

  const [openNotAttendingModel, setOpenNotAttendingModel] = useState(false)

  const handleClose = () => {
    setOpenNotAttendingModel(false)
  }

  const handleNewAttendeeSubmit = () => {
    const errorState = {name: false, email: false}
    if (newAttendeeName === "") {
      errorState.name = true
      setNewAttendeeName("")
    }
    if (
      newAttendeeEmail === "" ||
      !newAttendeeEmail.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errorState.email = true
      setNewAttendeeEmail("")
    }

    if (!errorState.name && !errorState.email) {
      dispatch(
        postRetreatAttendees(retreat.id, newAttendeeName, newAttendeeEmail)
      )
      setNewAttendeeEmail("")
      setNewAttendeeName("")
      setAddDialogOpen(false)
    }

    setNewAttendeeErrorState(errorState)
  }

  return (
    <PageContainer>
      <PageSidenav
        activeItem="attendees"
        retreatIdx={retreatIdx}
        companyName={retreat?.company_name}
      />
      <PageBody appBar>
        <div className={classes.section}>
          {retreat.attendees_state !== "REGISTRATION_OPEN" && (
            <PageLockedModal pageDesc="This page will be unlocked when attendee registration opens" />
          )}

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end">
            <Typography variant="h1">Attendees</Typography>
            <Link
              variant="body1"
              underline="always"
              className={classes.notAttendingButton}
              onClick={() => {
                setOpenNotAttendingModel(true)
              }}>
              View invitees not coming (
              {attendeeTravelInfo &&
                attendeeTravelInfo.filter((attendee) => {
                  return attendee.info_status === "NOT_ATTENDING"
                }).length}
              )
            </Link>
          </Box>

          <AppExpandableTable
            headers={[
              {
                name: "Employee",
                colId: "name",
                comparator: (r1, r2) => {
                  if (!r1.item.name) {
                    return -1
                  }
                  if (!r2.item.name) {
                    return 1
                  }
                  return r1.item.name
                    .toString()
                    .localeCompare(r2.item.name.toString())
                },
              },
              {name: "Email", colId: "email_address"},
              {
                name: "Employee City",
                colId: "city",
                comparator: (r1, r2) => {
                  if (r1.item.city == null) {
                    return -1
                  } else if (r2.item.city == null) {
                    return 1
                  } else {
                    return r1.item.city.localeCompare(r2.item.city)
                  }
                },
              },
              {
                name: "Dietary Preferences",
                colId: "dietary_prefs",
                renderCell: (val) => (
                  <DietList
                    prefString={val as RetreatAttendeeModel["dietary_prefs"]}
                  />
                ),
              },
              {
                name: "",
                colId: "notes",
                renderCell: (val) => {
                  if (val) {
                    return (
                      <HtmlTooltip
                        placement="left"
                        title={
                          <AppTypography
                            color="textPrimary"
                            style={{whiteSpace: "pre-wrap"}}>
                            {val}
                          </AppTypography>
                        }>
                        <div>
                          <AppTypography underline>Other notes</AppTypography>
                        </div>
                      </HtmlTooltip>
                    )
                  } else {
                    return <></>
                  }
                },
              },
            ]}
            rows={
              attendeeTravelInfo !== undefined
                ? attendeeTravelInfo
                    .filter(
                      (attendee) => attendee.info_status !== "NOT_ATTENDING"
                    )
                    .sort((a, b) => {
                      let getVal = (val: RetreatAttendeeModel) => {
                        switch (val.info_status) {
                          case "INFO_ENTERED":
                            return 1
                          default:
                            return 0
                        }
                      }
                      return getVal(b) - getVal(a)
                    })
                    .map((info: RetreatAttendeeModel) => ({
                      id: info.id,
                      disabled: !info.info_status.endsWith("INFO_ENTERED"),
                      tooltip: !info.info_status.endsWith("INFO_ENTERED")
                        ? "Once the attendee fills out the registration form you will be able to view more of their information here."
                        : "",
                      item: info,
                    }))
                : []
            }
            rowDeleteCallback={(row) => {
              dispatch(deleteRetreatAttendees(retreat.id, row.item.id))
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
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
          <DialogTitle>Add New Attendee</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a new attendee to your retreat please enter their full name
              and email address below. We'll reach out to them to confirm and
              fill in some of their information and when they have confirmed
              their name will be added here.
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
        {/* not attending modal below */}
        <div>
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={openNotAttendingModel}>
            <DialogTitle id="customized-dialog-title">
              Invitees not attending
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={() => {
                  setOpenNotAttendingModel(false)
                }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers className={classes.notAttendingDialogBody}>
              {attendeeTravelInfo &&
              attendeeTravelInfo.filter((attendee) => {
                return attendee.info_status === "NOT_ATTENDING"
              }).length ? (
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                      {attendeeTravelInfo &&
                        attendeeTravelInfo
                          .filter((attendee) => {
                            return attendee.info_status === "NOT_ATTENDING"
                          })
                          .map((attendee) => (
                            <TableRow key={attendee.id}>
                              <TableCell component="th" scope="row">
                                {attendee.name}
                              </TableCell>
                              <TableCell align="right">
                                {attendee.email_address}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <p className={classes.allAttendingP}>
                  No invitees are registered as not attending
                </p>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatAttendeesPage)
