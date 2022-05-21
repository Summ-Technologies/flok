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
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core"
import {Delete, DoneAll, Person} from "@material-ui/icons"
import CloseIcon from "@material-ui/icons/Close"
import {Alert} from "@material-ui/lab"
import {push} from "connected-react-router"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {withRouter} from "react-router-dom"
import AppCsvXlsxUpload from "../../components/base/AppCsvXlsxUpload"
import AppExpandableTable from "../../components/base/AppExpandableTable"
import AppTypography from "../../components/base/AppTypography"
import PageBody from "../../components/page/PageBody"
import PageLockedModal from "../../components/page/PageLockedModal"
import {RetreatAttendeeModel, SampleLockedAttendees} from "../../models/retreat"
import {AppRoutes} from "../../Stack"
import {ApiAction} from "../../store/actions/api"
import {
  deleteRetreatAttendees,
  postRetreatAttendees,
  postRetreatAttendeesBatch,
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
  previewTable: {
    // maxWidth: "70%",
  },
  errorText: {
    color: theme.palette.error.main,
  },
  errorTableContainer: {
    marginTop: 8,
    maxHeight: 200,
  },
  errorTable: {
    height: "max-content",
  },
  successfulUploadDiv: {
    display: "flex",
  },
  uploadPreviewFooter: {
    marginLeft: theme.spacing(1),
  },
  actionButtons: {
    marginLeft: "auto",
  },
  actionButtonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "right",
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
  const [batchUploadingPage, setBatchUploadingPage] = useState(false)
  const [batchUploadData, setBatchUploadData] = useState<
    {
      email_address: string
      first_name: string
      last_name: string
      retreat_id: number
    }[]
  >([])
  const [batchUploadResponse, setBatchUploadResponse] = useState<
    string | Partial<RetreatAttendeeModel>[]
  >("")

  const handleClose = () => {
    setOpenNotAttendingModal(false)
  }
  const handleFileUploaded = (data: string[][]) => {
    setBatchUploadData(
      data.map((row) => {
        return {
          email_address: row[0],
          first_name: row[1],
          last_name: row[2],
          retreat_id: retreat.id,
        }
      })
    )
  }

  function batchAttendeeResponsetoJSX(
    response: string | Partial<RetreatAttendeeModel>[]
  ) {
    if (response === "success") {
      return (
        <div className={classes.successfulUploadDiv}>
          <DoneAll />
          &nbsp;
          <Typography>All Attendees successfully added</Typography>
        </div>
      )
    } else {
      response = response as unknown as Partial<RetreatAttendeeModel>[]
      return (
        <>
          <Alert severity="warning">
            The following attendees could not be added as they were found to be
            duplicates
          </Alert>
          <TableContainer
            component={Paper}
            className={classes.errorTableContainer}>
            <Table size="small" className={classes.errorTable}>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {response.map((user) => {
                  return (
                    <TableRow>
                      <TableCell>{user.email_address}</TableCell>
                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )
    }
  }

  async function handleBatchAttendeeSubmit() {
    let response = (await dispatch(
      postRetreatAttendeesBatch({attendees: batchUploadData}, retreat.id)
    )) as unknown as ApiAction
    if (!response.error) {
      // setAddDialogOpen(false)
      // setBatchUploadingPage(false)
      setBatchUploadData([])
      if (!response.payload.errors[0]) {
        setBatchUploadResponse("success")
      } else {
        setBatchUploadResponse(response.payload.errors)
      }
    }
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
        <DialogTitle>
          {batchUploadingPage ? "Batch Upload Attendees" : "Add New Attendee"}
        </DialogTitle>
        <DialogContent>
          {batchUploadingPage ? (
            batchUploadResponse[0] ? (
              batchAttendeeResponsetoJSX(batchUploadResponse)
            ) : (
              <>
                <DialogContentText>
                  To batch upload, please upload a CSV or XLSX file. The file
                  should be in the format Email, First Name, Last Name, with no
                  headers.
                </DialogContentText>
                {batchUploadData[0] && (
                  <TableContainer
                    component={Paper}
                    className={classes.previewTable}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Email</TableCell>
                          <TableCell>First Name</TableCell>
                          <TableCell>Last Name</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {batchUploadData.slice(0, 3).map((user) => {
                          return (
                            <TableRow>
                              <TableCell>{user.email_address}</TableCell>
                              <TableCell>{user.first_name}</TableCell>
                              <TableCell>{user.last_name}</TableCell>
                            </TableRow>
                          )
                        })}

                        {batchUploadData.length > 3 && (
                          <TableFooter>
                            <div className={classes.uploadPreviewFooter}>
                              ... {batchUploadData.length - 3} more row
                              {batchUploadData.length - 3 > 1 && "s"}
                            </div>
                          </TableFooter>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )
          ) : (
            <>
              <DialogContentText>
                To add a new attendee to your retreat please enter their full
                name and email address below. We'll reach out to them to confirm
                and fill in some of their information and when they have
                confirmed their name will be added here.
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          <div className={classes.actionButtonsContainer}>
            {!batchUploadingPage && (
              <Button
                onClick={() => {
                  setBatchUploadingPage(true)
                }}>
                Batch Upload
              </Button>
            )}
            {batchUploadingPage && batchUploadData[0] && (
              <AppCsvXlsxUpload
                text="Upload New File"
                onUpload={handleFileUploaded}
              />
            )}
            <div className={classes.actionButtons}>
              {!batchUploadResponse[0] &&
                (batchUploadingPage && !batchUploadData[0] ? (
                  <AppCsvXlsxUpload onUpload={handleFileUploaded} />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      batchUploadingPage
                        ? handleBatchAttendeeSubmit
                        : handleNewAttendeeSubmit
                    }>
                    Submit
                  </Button>
                ))}
              {!batchUploadResponse[0] && (
                <Button
                  onClick={() => {
                    setAddDialogOpen(false)
                    setBatchUploadingPage(false)
                    setBatchUploadData([])
                  }}>
                  Cancel
                </Button>
              )}
              {batchUploadResponse[0] && (
                <Button
                  onClick={() => {
                    setAddDialogOpen(false)
                    setBatchUploadingPage(false)
                    setBatchUploadData([])
                    setBatchUploadResponse("")
                  }}>
                  Done
                </Button>
              )}
            </div>
          </div>
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
