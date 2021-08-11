import {Button, Grid, makeStyles, Paper, TextField} from "@material-ui/core"
import {useFormik} from "formik"
import {useState} from "react"
import * as yup from "yup"
import AppLogo from "../base/AppLogo"
import AppTypography from "../base/AppTypography"
import AppAttendeesRangeInput from "./AppAttendeesRangeInput"
import AppDatesRangeInput from "./AppDatesRangeInput"

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
    marginTop: "auto",
  },
  formBody: {
    minHeight: "100%",
  },
}))

type RFPFormValues = {
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
}

type LodgingPreferencesFormProps = {}
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
    },
    onSubmit: (vals) => {
      alert("submitted")
      console.log({...formData, ...vals})
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
              size="large">
              Next Step
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

let StepOneValidation = yup.object().shape({
  name: yup.string().required("Missing required fields"),
  email: yup.string().email().required(),
  companyName: yup.string().min(3).required(),
})
function RFPFormBodyStepOne(props: {formik: any}) {
  return (
    <Grid container spacing={4}>
      <Grid container alignItems="center" justify="space-between" item xs={12}>
        <Grid item>
          <AppTypography variant="h4">What's your name?</AppTypography>
        </Grid>
        <Grid item>
          <TextField
            id="name"
            value={props.formik.values.name}
            error={props.formik.touched.name && props.formik.errors.name}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Leeroy Jenkins"
            onChange={props.formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="space-between" item xs={12}>
        <AppTypography variant="h4">What's your email?</AppTypography>
        <Grid item>
          <TextField
            id="email"
            value={props.formik.values.email}
            error={props.formik.touched.email && props.formik.errors.email}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="leeroy@goflok.com"
            onChange={props.formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="space-between" item xs={12}>
        <AppTypography variant="h4">What's your company?</AppTypography>
        <Grid item>
          <TextField
            id="companyName"
            value={props.formik.values.companyName}
            error={
              props.formik.touched.companyName &&
              props.formik.errors.companyName
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
  attendeesLower: yup.number().required(),
  attendeesUpper: yup.number().required(),
  isExactDates: yup.boolean().required(),
  startDate: yup.date().when("isExactDates", {
    is: true,
    then: yup.date().required(),
  }),
  endDate: yup.date().when("isExactDates", {
    is: true,
    then: yup.date().required(),
  }),
  numNights: yup.number().when("isExactDates", {
    is: false,
    then: yup.number().required(),
  }),
  preferredMonths: yup.array().when("isExactDates", {
    is: false,
    then: yup
      .array(yup.string())
      .min(1, "Please select at least one preferred month")
      .required(),
  }),
})

function RFPFormBodyStepTwo(props: {formik: any}) {
  return (
    <Grid container spacing={4}>
      <Grid container alignItems="center" justify="space-between" item xs={12}>
        <Grid item>
          <AppTypography variant="h4">How many attendees?</AppTypography>
          <AppTypography variant="body2" color="textSecondary">
            If you’re not 100% sure just start with a best guess.
          </AppTypography>
        </Grid>
        <Grid item>
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
      <Grid container alignItems="center" justify="space-between" item xs={12}>
        <Grid item>
          <AppTypography variant="h4">When do you want to go?</AppTypography>
          <AppTypography variant="body2" color="textSecondary">
            Exact dates or a time of year, you tell us.
          </AppTypography>
        </Grid>
        <Grid item>
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
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
