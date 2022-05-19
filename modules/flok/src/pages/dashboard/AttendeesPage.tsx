import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  makeStyles,
  MenuItem,
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
import {Delete, Person} from "@material-ui/icons"
import CloseIcon from "@material-ui/icons/Close"
import {push} from "connected-react-router"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {withRouter} from "react-router-dom"
import AppExpandableTable from "../../components/base/AppExpandableTable"
import AppTypography from "../../components/base/AppTypography"
import PageBody from "../../components/page/PageBody"
import PageLockedModal from "../../components/page/PageLockedModal"
import {RetreatAttendeeModel, SampleLockedAttendees} from "../../models/retreat"
import {AppRoutes} from "../../Stack"
import {
  deleteRetreatAttendees,
  postRetreatAttendees,
} from "../../store/actions/retreat"
import {useRetreatAttendees} from "../../utils/retreatUtils"
import {useRetreat} from "../misc/RetreatProvider"

const HtmlTooltip = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: theme.palette.background.default,
    border: "1px solid #dadde9",
  },
}))

function dateFormat(date?: string) {
  if (date === undefined) {
    return ""
  }
  let dateFormatter = Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeZone: "UTC",
  })
  return dateFormatter.format(new Date(date))
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
  notAttendingDialogBody: {
    padding: "0 !important",
    maxHeight: "30vh",
  },
  allAttendingP: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}))

function AttendeesPage() {
  let classes = useStyles()
  let dispatch = useDispatch()

  let [retreat, retreatIdx] = useRetreat()

  let [attendeeTravelInfo] = useRetreatAttendees(retreat.id)

  let [addDialogOpen, setAddDialogOpen] = useState(false)
  let [newAttendeeFirstName, setNewAttendeeFirstName] = useState("")
  let [newAttendeeLastName, setNewAttendeeLastName] = useState("")
  let [newAttendeeEmail, setNewAttendeeEmail] = useState("")
  let [newAttendeeErrorState, setNewAttendeeErrorState] = useState({
    firstName: false,
    lastName: false,
    email: false,
  })
  if (retreat.attendees_state !== "REGISTRATION_OPEN") {
    attendeeTravelInfo = SampleLockedAttendees
  }

  const [openNotAttendingModal, setOpenNotAttendingModal] = useState(false)

  const handleClose = () => {
    setOpenNotAttendingModal(false)
  }

  const handleNewAttendeeSubmit = () => {
    const errorState = {firstName: false, lastName: false, email: false}
    if (newAttendeeFirstName === "") {
      errorState.firstName = true
      setNewAttendeeFirstName("")
    }
    if (newAttendeeLastName === "") {
      errorState.lastName = true
      setNewAttendeeLastName("")
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

    if (!errorState.firstName && !errorState.lastName && !errorState.email) {
      dispatch(
        postRetreatAttendees(
          retreat.id,
          newAttendeeFirstName,
          newAttendeeLastName,
          newAttendeeEmail
        )
      )
      setNewAttendeeEmail("")
      setNewAttendeeFirstName("")
      setNewAttendeeLastName("")
      setAddDialogOpen(false)
    }

    setNewAttendeeErrorState(errorState)
  }

  return (
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
              setOpenNotAttendingModal(true)
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
              name: "Last Name",
              colId: "last_name",
              comparator: (r1, r2) => {
                if (!r1.item.last_name) return 1
                if (!r2.item.last_name) return -1
                return r1.item.last_name.localeCompare(r2.item.last_name)
              },
            },
            {
              name: "First Name",
              colId: "first_name",
              comparator: (r1, r2) => {
                if (!r1.item.first_name) return 1
                if (!r2.item.first_name) return -1
                return r1.item.first_name.localeCompare(r2.item.first_name)
              },
            },
            {name: "Email", colId: "email_address"},
            {
              name: "Hotel check in",
              colId: "hotel_check_in",
              renderCell: (val) => (
                <AppTypography>
                  {val != null ? dateFormat(val as string) : undefined}
                </AppTypography>
              ),
            },
            {
              name: "Hotel check out",
              colId: "hotel_check_out",
              renderCell: (val) => (
                <AppTypography>
                  {val != null ? dateFormat(val as string) : undefined}
                </AppTypography>
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
          menuItems={(row) => {
            let editMenuItem = (
              <MenuItem
                onClick={() =>
                  dispatch(
                    push(
                      AppRoutes.getPath("RetreatAttendeePage", {
                        retreatIdx: retreatIdx.toString(),
                        attendeeId: row.item.id.toString(),
                      })
                    )
                  )
                }>
                <Person />
                Edit
              </MenuItem>
            )
            let deleteMenuItem = (
              <MenuItem
                onClick={() => {
                  dispatch(deleteRetreatAttendees(retreat.id, row.item.id))
                }}>
                <Delete />
                Delete
              </MenuItem>
            )

            return [editMenuItem, deleteMenuItem]
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
            and email address below. We'll reach out to them to confirm and fill
            in some of their information and when they have confirmed their name
            will be added here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="first_name"
            label="First Name"
            value={newAttendeeFirstName}
            error={newAttendeeErrorState.firstName}
            onChange={(e) => setNewAttendeeFirstName(e.target.value)}
            fullWidth
            variant="standard"
            required
          />
          <TextField
            margin="dense"
            id="last_name"
            label="Last Name"
            value={newAttendeeLastName}
            error={newAttendeeErrorState.lastName}
            onChange={(e) => setNewAttendeeLastName(e.target.value)}
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
          open={openNotAttendingModal}>
          <DialogTitle id="customized-dialog-title">
            Invitees not attending
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => {
                setOpenNotAttendingModal(false)
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
                <Table aria-label="simple table">
                  <TableBody>
                    {attendeeTravelInfo &&
                      attendeeTravelInfo
                        .filter((attendee) => {
                          return attendee.info_status === "NOT_ATTENDING"
                        })
                        .map((attendee) => (
                          <TableRow key={attendee.id}>
                            <TableCell component="th" scope="row">
                              {attendee.first_name + " " + attendee.last_name}
                            </TableCell>
                            <TableCell align="right">
                              {attendee.email_address}
                            </TableCell>
                            <TableCell>
                              {" "}
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  dispatch(
                                    push(
                                      AppRoutes.getPath("RetreatAttendeePage", {
                                        retreatIdx: retreatIdx.toString(),
                                        attendeeId: attendee.id.toString(),
                                      })
                                    )
                                  )
                                }>
                                Edit <Person />
                              </Button>
                            </TableCell>{" "}
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
  )
}

export default withRouter(AttendeesPage)
