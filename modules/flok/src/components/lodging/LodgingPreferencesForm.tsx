import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core"
import {useFormik} from "formik"
import {useState} from "react"
import * as yup from "yup"
import AppLogo from "../base/AppLogo"
import AppTypography from "../base/AppTypography"
import AppAttendeesRangeInput from "./AppAttendeesRangeInput"
import AppDatesRangeInput from "./AppDatesRangeInput"
import AppMeetingSpacesInput from "./AppMeetingSpacesInput"
import AppRoomTypeInput from "./AppRoomTypeInput"

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    padding: theme.spacing(4),
    height: "100%",
    "& > form": {
      height: "100%",
    },
    overflowY: "auto",
  },
  ctaContainer: {
    flexDirection: "row-reverse",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: theme.spacing(2),
  },
  formBody: {
    minHeight: "100%",
  },
}))

export type RFPFormValues = {
  name?: string
  email?: string
  companyName?: string
  attendeesLower?: number
  attendeesUpper?: number
  isExactDates?: boolean
  startDate?: Date
  endDate?: Date
  numNights?: number
  preferredMonths?: string[]
  meetingSpaces?: string[]
  numBreakoutRooms?: number
  roomingType?: string
}

type LodgingPreferencesFormProps = {
  onSubmit: (vals: RFPFormValues) => void
  isLoading?: boolean
  onError: (error: string) => void
}
export default function LodgingPreferencesForm(
  props: LodgingPreferencesFormProps
) {
  const classes = useStyles()
  let [step, setStep] = useState(0)
  let [formData, setFormData] = useState<RFPFormValues>({})
  let formik1 = useFormik({
    validationSchema: StepOneValidation,
    initialValues: {name: "", email: "", companyName: ""},
    onSubmit: (vals) => {
      setFormData({...formData, ...vals})
      setStep(step + 1)
    },
  })
  let formik2 = useFormik({
    validationSchema: StepTwoValidation,
    initialValues: {
      attendeesLower: undefined,
      attendeesUpper: undefined,
      isExactDates: true,

      startDate: undefined,
      endDate: undefined,

      numNights: 1,
      preferredMonths: [],

      meetingSpaces: [],
      numBreakoutRooms: 1,

      roomingType: "",
    },
    onSubmit: (vals) => {
      props.onSubmit({...formData, ...vals})
    },
  })

  let formikSteps = [formik1, formik2]
  let steps = [
    <RFPFormBodyStepOne formik={formik1} />,
    <RFPFormBodyStepTwo formik={formik2} />,
  ]
  return (
    <Paper className={classes.root}>
      <form onSubmit={formikSteps[step].handleSubmit}>
        <Grid
          className={classes.formBody}
          container
          direction="column"
          justify="space-between">
          <Grid container direction="column" spacing={6} item>
            <Grid item>
              <AppLogo height={40} noBackground />
              <AppTypography variant="h1">Let's Get Started!</AppTypography>
              <AppTypography variant="body1">
                We need just a few details to plan your perfect retreat.
              </AppTypography>
            </Grid>
            <Grid item>{steps[step]}</Grid>
          </Grid>
          <Grid item className={classes.ctaContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={props.isLoading}
              onClick={() => {
                if (Object.values(formikSteps[step].errors).length > 0) {
                  Object.values(formikSteps[step].errors)
                    .slice(0, 3)
                    .forEach((err) => {
                      if (typeof err === "string") {
                        props.onError(err)
                      } else if (err && err.length > 0) {
                        props.onError(err[0])
                      }
                    })
                }
              }}>
              {step === steps.length - 1 ? (
                props.isLoading ? (
                  <CircularProgress
                    size={`${0.9375 * 1.75}rem`}
                    color="inherit"
                  />
                ) : (
                  "Submit"
                )
              ) : (
                "Next Step"
              )}
            </Button>
            {step > 0 ? (
              <Button
                onClick={() => {
                  setFormData({...formData, ...formikSteps[step].values})
                  setStep(step - 1)
                }}
                variant="outlined"
                color="primary"
                size="large">
                Go Back
              </Button>
            ) : undefined}
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

let StepOneValidation = yup.object().shape({
  name: yup.string().required("Name is a required field."),
  email: yup.string().email().required("Email is a required field."),
  companyName: yup.string().min(3).required("Company is a required field."),
})
function RFPFormBodyStepOne(props: {formik: any}) {
  return (
    <Grid container spacing={4}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justify="space-between"
        item
        xs={12}>
        <Grid item>
          <AppTypography variant="h4">What's your name?</AppTypography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="name"
            value={props.formik.values.name}
            error={!!(props.formik.touched.name && props.formik.errors.name)}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Leeroy Jenkins"
            onChange={props.formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justify="space-between"
        item
        xs={12}>
        <Grid item>
          <AppTypography variant="h4">What's your email?</AppTypography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="email"
            value={props.formik.values.email}
            error={!!(props.formik.touched.email && props.formik.errors.email)}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="leeroy@goflok.com"
            onChange={props.formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justify="space-between"
        item
        xs={12}>
        <Grid item>
          <AppTypography variant="h4">What's your company?</AppTypography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="companyName"
            value={props.formik.values.companyName}
            error={
              !!(
                props.formik.touched.companyName &&
                props.formik.errors.companyName
              )
            }
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Flok"
            onChange={props.formik.handleChange}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

let StepTwoValidation = yup.object().shape({
  attendeesLower: yup.number().required("Number of attendees is required."),
  attendeesUpper: yup.number().required("Number of attendees is required."),
  isExactDates: yup.boolean().required(),
  startDate: yup.date().when("isExactDates", {
    is: true,
    then: yup.date().required("Start date is required."),
  }),
  endDate: yup.date().when("isExactDates", {
    is: true,
    then: yup.date().required("End date is required."),
  }),
  numNights: yup.number().when("isExactDates", {
    is: false,
    then: yup.number().required("Number of nights is required."),
  }),
  preferredMonths: yup.array().when("isExactDates", {
    is: false,
    then: yup
      .array(yup.string())
      .min(1, "At least one preferred month is required")
      .required("At least one preferred month is required"),
  }),
  meetingSpaces: yup.array(yup.string()),
  numBreakoutRooms: yup.number().when("meetingSpaces", {
    is: (val: string[]) => val.includes("breakout"),
    then: yup.number().required().min(1),
  }),
  roomingType: yup.string().required("Room type is a required field."),
})

function RFPFormBodyStepTwo(props: {formik: any}) {
  return (
    <Grid container spacing={4}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        alignContent="space-between"
        justify="space-between"
        item
        xs={12}>
        <Grid item>
          <AppTypography variant="h4">How many attendees?</AppTypography>
          <AppTypography variant="body2" color="textSecondary">
            If you’re not 100% sure just start with a best guess.
          </AppTypography>
        </Grid>
        <Grid item xs={12} md="auto">
          <AppAttendeesRangeInput
            error={
              !!(
                props.formik.touched.attendeesLower &&
                props.formik.touched.attendeesUpper &&
                (props.formik.errors.attendeesLower ||
                  props.formik.errors.attendeesUpper)
              )
            }
            lower={props.formik.values.attendeesLower}
            upper={props.formik.values.attendeesUpper}
            onChange={(lower, upper) => {
              props.formik.setFieldValue("attendeesLower", lower)
              props.formik.setFieldValue("attendeesUpper", upper)
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justify="space-between"
        item
        xs={12}>
        <Grid item xs={12} md={6}>
          <AppTypography variant="h4">When do you want to go?</AppTypography>
          <AppTypography variant="body2" color="textSecondary">
            Exact dates or a time of year, you tell us.
          </AppTypography>
        </Grid>
        <Grid item xs={12} md="auto">
          <AppDatesRangeInput
            isExactDates={props.formik.values.isExactDates}
            onChangeIsExactDates={(isExact) =>
              props.formik.setFieldValue("isExactDates", isExact)
            }
            start={props.formik.values.startDate}
            end={props.formik.values.endDate}
            onChangeDateRange={(start, end) => {
              if (start === end) {
                end = undefined
              }
              props.formik.setFieldValue("startDate", start)
              props.formik.setFieldValue("endDate", end)
            }}
            numNights={props.formik.values.numNights}
            onChangeNumNights={(val) =>
              props.formik.setFieldValue("numNights", val)
            }
            preferredMonths={props.formik.values.preferredMonths}
            onChangePreferredMonths={(vals) => {
              props.formik.setFieldValue("preferredMonths", vals)
            }}
            error={
              !!(
                props.formik.touched.isExactDates &&
                (props.formik.errors.isExactDates ||
                  props.formik.errors.startDate ||
                  props.formik.errors.endDate ||
                  props.formik.errors.numNights ||
                  props.formik.errors.preferredMonths)
              )
            }
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justify="space-between"
        item
        xs={12}>
        <Grid item xs={12}>
          <AppTypography variant="h4">
            What types of spaces do you need?
          </AppTypography>
        </Grid>
        <Grid item xs={12}>
          <AppMeetingSpacesInput
            numBreakoutRooms={props.formik.values.numBreakoutRooms}
            values={props.formik.values.meetingSpaces}
            onChange={(newVals, newNumRooms) => {
              props.formik.setFieldValue("meetingSpaces", newVals)
              props.formik.setFieldValue("numBreakoutRooms", newNumRooms)
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justify="space-between"
        item
        xs={12}>
        <Grid item xs={12}>
          <AppTypography variant="h4">
            What types of rooms do you prefer?
          </AppTypography>
        </Grid>
        <Grid item xs={12}>
          <AppRoomTypeInput
            value={props.formik.values.roomingType}
            onChange={(newVal) => {
              props.formik.setFieldValue("roomingType", newVal)
            }}
            error={
              !!(
                props.formik.touched.roomingType &&
                props.formik.errors.roomingType
              )
            }
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
