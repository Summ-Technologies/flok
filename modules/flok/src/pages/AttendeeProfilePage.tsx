import {
  Avatar,
  Button,
  Icon,
  makeStyles,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  useMediaQuery,
} from "@material-ui/core"
import {AccountBox, ArrowBackIos, FlightTakeoff} from "@material-ui/icons"
import {Autocomplete} from "@material-ui/lab"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import _ from "lodash"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Prompt, RouteComponentProps} from "react-router-dom"
import * as yup from "yup"
import AttendeeFlightTab from "../components/flights/AttendeeFlightTab"
import AppTabPanel from "../components/page/AppTabPanel"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getAttendee, patchAttendee} from "../store/actions/retreat"
import {FlokTheme} from "../theme"
import {useQuery} from "../utils"
import {useRetreat} from "./misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
    "& > *:not(:first-child)": {
      paddingLeft: theme.spacing(1),
    },
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  avatar: {
    backgroundColor: "orange",
    height: "12vh",
    width: "12vh",
    minHeight: "50px",
    minWidth: "50px",
    textAlign: "center",
  },
  avatarDiv: {
    display: "flex",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
    alignItems: "center",
    backgroundColor: "white",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    },
  },
  textField: {
    maxWidth: "25vw",
    minWidth: "320px",
  },
  submitButton: {
    maxWidth: "25vw",
  },
  body: {
    width: "100%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  tabs: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minWidth: "175px",
  },
  tab: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(1.5),
    cursor: "pointer",
  },
  fullPageTab: {
    flex: "1 1 auto",
    height: 0,
  },
}))

type AttendeesProfileProps = RouteComponentProps<{
  retreatIdx: string
  attendeeIdx: string
}>

function AttendeeProfilePage(props: AttendeesProfileProps) {
  let dispatch = useDispatch()
  let [tabQuery, setTabQuery] = useQuery("tab")
  let [tabValue, setTabValue] = useState<string | undefined | number>(0)
  useEffect(() => {
    const TABS = ["profile", "flights"]
    setTabValue(tabQuery && TABS.includes(tabQuery) ? tabQuery : "profile")
  }, [tabQuery, setTabValue])
  let [newOption, setNewOption] = useState("")
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )
  const DIETARY_OPTIONS = new Set([
    "Gluten Free",
    "Peanut Free",
    "Dairy Free",
    "Vegetarian",
    "Vegan",
    "Kosher",
  ])
  const RetreatAttendeeInfoStatusOptions = [
    {value: "CREATED", text: "Pending"},
    {value: "INFO_ENTERED", text: "Registered"},
    {value: "NOT_ATTENDING", text: "Not Attending"},
  ]

  let classes = useStyles()
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let attendeeIdx = parseInt(props.match.params.attendeeIdx)
  let retreat = useRetreat()
  let attendee = useSelector((state: RootState) => {
    if (attendeeIdx != null) {
      return state.retreat.attendees[attendeeIdx]
    }
  })

  useEffect(() => {
    !attendee && dispatch(getAttendee(attendeeIdx))
  }, [attendeeIdx, attendee, dispatch])
  let formik = useFormik({
    initialValues: {
      email_address:
        attendee && attendee.email_address ? attendee.email_address : "",
      first_name: attendee && attendee.first_name ? attendee.first_name : "",
      last_name: attendee && attendee.last_name ? attendee.last_name : "",
      notes: attendee && attendee.notes ? attendee.notes : "",
      dietary_prefs:
        attendee && attendee.dietary_prefs ? attendee.dietary_prefs : "",
      info_status: attendee && attendee.info_status ? attendee.info_status : "",
      hotel_check_in:
        attendee && attendee.hotel_check_in ? attendee.hotel_check_in : "",
      hotel_check_out:
        attendee && attendee.hotel_check_out ? attendee.hotel_check_out : "",
    },
    onSubmit: (values) => {
      dispatch(patchAttendee(attendeeIdx, values))
    },
    validate: (values) => {
      try {
        yup.string().required().email().validateSync(values.email_address)
      } catch (err) {
        return {email_address: "Please enter a valid email."}
      }
      return {}
    },
    enableReinitialize: true,
  })

  useEffect(() => {
    if (!_.isEqual(formik.values, formik.initialValues)) {
      window.addEventListener("beforeunload", alertUser)
      return () => {
        window.removeEventListener("beforeunload", alertUser)
      }
    }
  }, [formik.values, formik.initialValues])
  const alertUser = (e: any) => {
    e.preventDefault()
    e.returnValue = ""
  }
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }
  return (
    <PageContainer>
      <PageSidenav activeItem="attendees" retreatIdx={retreatIdx} />

      <PageBody appBar>
        <Prompt
          when={
            !_.isEqual(formik.values, formik.initialValues) &&
            tabQuery !== "flights"
          }
          message={() =>
            "Are you sure you want to leave without saving your changes?"
          }
        />
        <div className={classes.section}>
          <Tabs
            orientation={isSmallScreen ? "horizontal" : "vertical"}
            className={classes.tabs}
            value={tabValue}
            onChange={(e, newVal) =>
              setTabQuery(newVal === "profile" ? null : newVal)
            }
            variant="fullWidth"
            indicatorColor="primary">
            <div
              className={classes.tab}
              onClick={() => {
                dispatch(
                  push(
                    AppRoutes.getPath("RetreatAttendeesPage", {retreatIdx: "0"})
                  )
                )
              }}>
              <Icon>
                <ArrowBackIos />
              </Icon>
              All Attendees
            </div>
            <Tab
              className={classes.tab}
              value="profile"
              icon={<AccountBox />}
              label={isSmallScreen ? "" : "Attendee Profile"}
            />
            <Tab
              className={classes.tab}
              value="flights"
              icon={<FlightTakeoff />}
              label={isSmallScreen ? "" : "Attendee Flights"}
            />
          </Tabs>
          <AppTabPanel
            show={tabValue === "profile"}
            className={`${classes.tab} ${classes.fullPageTab}`}
            renderDom="on-shown">
            <div className={classes.body}>
              <form className={classes.form} onSubmit={formik.handleSubmit}>
                <Avatar className={classes.avatar}>
                  <div className={classes.avatarDiv}>
                    {attendee?.first_name
                      ? `${attendee.first_name[0]}${
                          attendee.last_name ? attendee.last_name[0] : ""
                        }`
                      : null}
                  </div>
                </Avatar>
                <TextField
                  {...textFieldProps}
                  id="info_status"
                  variant="outlined"
                  value={formik.values.info_status}
                  select
                  SelectProps={{native: true}}
                  label="Attendee Registration Status">
                  {RetreatAttendeeInfoStatusOptions.map((o, i) => (
                    <option key={i} value={o.value}>
                      {o.text}
                    </option>
                  ))}
                </TextField>
                <TextField
                  {...textFieldProps}
                  className={classes.textField}
                  variant="outlined"
                  label="First Name"
                  value={formik.values.first_name ?? ""}
                  id="first_name"
                />
                <TextField
                  {...textFieldProps}
                  className={classes.textField}
                  variant="outlined"
                  label="Last Name"
                  value={formik.values.last_name ?? ""}
                  id="last_name"
                />
                <TextField
                  {...textFieldProps}
                  className={classes.textField}
                  variant="outlined"
                  label="Email"
                  value={formik.values.email_address ?? ""}
                />
                <TextField
                  {...textFieldProps}
                  type="date"
                  className={classes.textField}
                  variant="outlined"
                  label="Hotel check out"
                  id="hotel_check_in"
                  value={formik.values.hotel_check_in ?? ""}
                />
                <TextField
                  {...textFieldProps}
                  type="date"
                  className={classes.textField}
                  variant="outlined"
                  label="Hotel check in"
                  id="hotel_check_out"
                  value={formik.values.hotel_check_out ?? ""}
                />
                <Autocomplete
                  fullWidth
                  multiple
                  id="preferences_dates_flexible_months"
                  options={Array.from(
                    new Set([
                      ...Array.from(DIETARY_OPTIONS).map((a) =>
                        a.toLocaleLowerCase()
                      ),
                      ...(formik.values.dietary_prefs
                        ? formik.values.dietary_prefs.split(",")
                        : []
                      ).map((a) => a.toLocaleLowerCase()),
                      ...(newOption && newOption.length > 1
                        ? [`Add \`${newOption.toLocaleLowerCase()}\``]
                        : []),
                    ])
                  )}
                  getOptionLabel={(option) => {
                    return (
                      option && option[0].toLocaleUpperCase() + option.slice(1)
                    )
                  }}
                  filterSelectedOptions
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  onInputChange={(e, value, reason) => {
                    if (reason !== "reset" || e != null) setNewOption(value)
                  }}
                  inputValue={newOption}
                  value={
                    formik.values.dietary_prefs
                      ?.split(",")
                      .filter((a) => !!a)
                      .map((a) => a.toLocaleLowerCase()) || []
                  }
                  onChange={(e, newVals) => {
                    newVals = newVals.map((val) => {
                      val = val.toLocaleLowerCase()
                      if (val.startsWith("add `")) {
                        val = val.slice(5, -1)
                      }
                      return val
                    })
                    formik.setFieldValue(
                      "dietary_prefs",
                      Array.from(
                        new Set(
                          newVals.sort().map((a) => a.toLocaleLowerCase())
                        )
                      ).join(",")
                    )
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        variant="outlined"
                        className={classes.textField}
                        {...params}
                        {...textFieldProps}
                        inputProps={{
                          ...params.inputProps,
                          onKeyPress: (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              return false
                            }
                          },
                        }}
                        onChange={undefined}
                        label="Dietary Preferences"
                        placeholder="Select a dietary restriction"
                      />
                    )
                  }}
                />
                <TextField
                  multiline
                  {...textFieldProps}
                  id="notes"
                  value={formik.values.notes ?? ""}
                  label="Other Notes"
                  placeholder="Enter other notes on the attendee"
                  className={classes.textField}
                  variant="outlined"
                  rows={2}
                  rowsMax={4}
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className={classes.submitButton}
                  disabled={_.isEqual(formik.values, formik.initialValues)}>
                  Save
                </Button>
              </form>
            </div>
          </AppTabPanel>
          <AppTabPanel
            show={tabValue === "flights"}
            className={`${classes.tab} ${classes.fullPageTab}`}
            renderDom="on-shown">
            {attendee && (
              <AttendeeFlightTab
                flights={attendee?.travel}
                attendee={attendee}
              />
            )}
          </AppTabPanel>
        </div>
      </PageBody>
    </PageContainer>
  )
}
export default AttendeeProfilePage
