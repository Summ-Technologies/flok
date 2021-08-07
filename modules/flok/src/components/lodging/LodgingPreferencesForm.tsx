import {Button, Grid, makeStyles, Paper, TextField} from "@material-ui/core"
import {useFormik} from "formik"
import {useState} from "react"
import * as yup from "yup"
import AppLogo from "../base/AppLogo"
import AppTypography from "../base/AppTypography"
import AppAttendeesRangeInput from "./AppAttendeesRangeInput"
import AppInputSelectLargeCardGroup from "./AppInputSelectLargeCardGroup"

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    padding: theme.spacing(4),
    height: "100%",
    overflowY: "auto",
  },
  ctaContainer: {
    marginTop: "auto",
  },
  formBody: {
    minHeight: "100%",
  },
}))

type LodgingPreferencesFormProps = {}
export default function LodgingPreferencesForm(
  props: LodgingPreferencesFormProps
) {
  const classes = useStyles()
  let [step, setStep] = useState(0)
  let steps = [
    <RFPFormBodyStepOne />,
    <RFPFormBodyStepTwo />,
    <RFPFormBodyStepThree />,
  ]
  let formik1 = useFormik({
    validationSchema: StepOneValidation,
    initialValues: {
      name: "",
      email: "",
      companyName: "",
    },
    onSubmit: () => {
      setStep(step + 1)
    },
  })

  let formik2 = useFormik({
    validationSchema: StepTwoValidation,
    initialValues: {},
    onSubmit: () => {
      setStep(step + 1)
    },
  })
  let formik3 = useFormik({
    validationSchema: StepThreeValidation,
    initialValues: {
      name: "",
      email: "",
      companyName: "",
    },
    onSubmit: () => undefined,
  })
  let formikSteps = [formik1, formik2, formik3]
  return (
    <Paper className={classes.root} component={"form"}>
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
          <Button variant="contained" color="primary" size="large">
            Next Step
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

let StepOneValidation = yup.object().shape({
  name: yup.string().required("This field is required"),
  email: yup.string().email().required("This field is required"),
  companyName: yup.string().min(3).required("This field is required"),
})
let StepTwoValidation = yup.object().shape({
  attendeesLower: yup.number().required("This field is required"),
  attendeesUpper: yup.number().required("This field is required"),
  isExactDates: yup.boolean().required("This field is required."),
  numNights: yup.number().when("isExactDates", {
    is: false,
    then: yup.number().required("This field is required."),
  }),
  preferredMonths: yup.array().when("isExactDates", {
    is: false,
    then: yup
      .array(yup.string())
      .min(1, "Please select at least one preferred month")
      .required(),
  }),
  preferredStartDays: yup.array().when("isExactDates", {
    is: false,
    then: yup.array(yup.string()),
  }),
})
let StepThreeValidation = yup.object().shape({})

function RFPFormBodyStepOne() {
  return (
    <Grid container spacing={4}>
      <Grid container alignItems="center" justify="space-between" item xs={12}>
        <Grid item>
          <AppTypography variant="h4">What's your name?</AppTypography>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Leeroy Jenkins"
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="space-between" item xs={12}>
        <AppTypography variant="h4">What's your email?</AppTypography>
        <Grid item>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="leeroy@goflok.com"
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="space-between" item xs={12}>
        <AppTypography variant="h4">What's your company?</AppTypography>
        <Grid item>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Flok"
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

function RFPFormBodyStepTwo() {
  let [[lower, upper], setRange] = useState<[number?, number?]>([
    undefined,
    undefined,
  ])
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
            lower={lower}
            upper={upper}
            onChange={(lower, upper) => setRange([lower, upper])}
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
          <TextField fullWidth variant="outlined" size="small" />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justify="space-between" item xs={12}>
        <Grid item>
          <AppTypography variant="h4">
            Did you have somewhere in mind?
          </AppTypography>
          <AppTypography variant="body2" color="textSecondary">
            Not sure yet? We can help you choose.
          </AppTypography>
        </Grid>
        <Grid item>
          <TextField fullWidth variant="outlined" size="small" />
        </Grid>
      </Grid>
    </Grid>
  )
}

function RFPFormBodyStepThree() {
  return (
    <Grid container spacing={4}>
      <Grid container direction="column" spacing={2} item xs={12}>
        <Grid item>
          <AppTypography variant="h4">
            What types of spaces do you need?
          </AppTypography>
        </Grid>
        <Grid item>
          <AppInputSelectLargeCardGroup
            values={[]}
            options={[
              {
                label: "Singles only",
                value: "singles",
                description:
                  "Each employee has their own room.  Increased cost, but recommended especially if it's your team's first retreat.",
              },
              {
                label: "Doubles",
                value: "doubles",
                description:
                  "Double rooms help reduce cost, but increase complexity slightly.",
              },
            ]}
            onChange={(val) => {}}
          />
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={2} item xs={12}>
        <Grid item>
          <AppTypography variant="h4">
            What types of spaces do you need?
          </AppTypography>
        </Grid>
        <Grid item>
          <AppInputSelectLargeCardGroup
            values={[]}
            options={[
              {
                label: "Singles only",
                value: "singles",
                description:
                  "Each employee has their own room.  Increased cost, but recommended especially if it's your team's first retreat.",
              },
              {
                label: "Doubles",
                value: "doubles",
                description:
                  "Double rooms help reduce cost, but increase complexity slightly.",
              },
            ]}
            onChange={(val) => {}}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
