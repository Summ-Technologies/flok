import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Paper,
  Select,
  TextField,
  useMediaQuery,
} from "@material-ui/core"
import {useFormik} from "formik"
import {useEffect, useState} from "react"
import * as yup from "yup"
import {FlokTheme} from "../../theme"
import AppTypography from "../base/AppTypography"
import AppDatePicker from "../lodging/AppDateRangePicker"
import AppInputSelectCardGroup from "../lodging/AppInputSelectCardGroup"
import AppInputSelectLargeCardGroup from "../lodging/AppInputSelectLargeCardGroup"
import AppInputToggle from "../lodging/AppInputToggle"

const useStyles = makeStyles((theme) => ({
  root: {},
  formSection: {
    "&:not(:first-child)": {
      marginTop: theme.spacing(6),
    },
  },
  formSectionHeader: {
    marginBottom: theme.spacing(3),
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(0.5),
    },
  },
  formPaper: {
    padding: theme.spacing(4),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2),
    },
  },
  inputHeader: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    "& *:after": {
      content: '"\\00a0"',
    },
    "& *": {
      lineHeight: 1,
    },
  },
  attendeesInputs: {
    alignItems: "baseline",
    padding: "0px",
    marginLeft: "1rem",
    marginRight: "1rem",
    width: 50,
  },
  submitButton: {
    marginTop: theme.spacing(4),
  },
}))

export type LodgingPreferencesFormValues = {
  numAttendeesLower: number | ""
  numAttendeesUpper: number | ""
  isExactDates: boolean
  meetingSpaces: string[]
  roomingPreferences: string[]

  // exact dates
  startDate: Date | ""
  endDate: Date | ""

  // i'm flexible
  numNights: number | ""
  preferredMonths: string[]
  preferredStartDays: string[]
}

let LodgingPreferencesCommonFormSchema = yup.object().shape({
  numAttendeesLower: yup
    .number()
    .positive()
    .required("This field is required."),
  numAttendeesUpper: yup
    .number()
    .positive()
    .required("This field is required."),
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
  meetingSpaces: yup.array(yup.string()),
  roomingPreferences: yup.array(yup.string()),
})

type LodgingPreferencesFormProps = {
  submitLodgingPreferencesForm: (
    values: LodgingPreferencesFormValues,
    resetForm: () => void
  ) => void
  isLoading?: boolean
}

export default function LodgingPreferencesForm(
  props: LodgingPreferencesFormProps
) {
  const classes = useStyles()
  let formik = useFormik<LodgingPreferencesFormValues>({
    initialValues: {
      numAttendeesUpper: "",
      numAttendeesLower: "",
      isExactDates: false,
      startDate: "",
      endDate: "",
      numNights: "",
      preferredMonths: [],
      preferredStartDays: [],
      meetingSpaces: [],
      roomingPreferences: [],
    },
    validationSchema: LodgingPreferencesCommonFormSchema,
    onSubmit: (values, helpers) => {
      props.submitLodgingPreferencesForm(values, helpers.resetForm)
    },
    validateOnMount: true,
  })

  let [disableSubmit, setDisableSubmit] = useState(true)
  useEffect(() => {
    // if # errors > 0, disableSubmit
    if (
      Object.values(formik.errors).reduce((prev, curr) => {
        if (curr !== undefined) {
          return prev + 1
        } else {
          return prev
        }
      }, 0) > 0
    ) {
      setDisableSubmit(true)
    } else {
      setDisableSubmit(false)
    }
  }, [setDisableSubmit, formik.errors])

  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )

  const preventMinus = (e: any) => {
    if (
      e.code === "Minus" ||
      e.which < 48 ||
      e.which > 57 ||
      e.target.value.length > 3
    ) {
      e.preventDefault()
    }
  }

  // Get values (by year) for flexible month selection
  function getOption(month: number, year: number) {
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    return {
      label: months[month],
      value: `${months[month]}-${year}`,
    }
  }
  let thisYear = new Date().getFullYear()
  let thisMonth = new Date().getMonth()

  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <div className={classes.formSection}>
        <div className={classes.formSectionHeader}>
          <AppTypography variant="h4">
            A few questions about your retreat
          </AppTypography>
          <AppTypography variant="body1">
            We'll put together proposals for different venues in your selected
            destination, but first we need to confirm some retreat details!
          </AppTypography>
        </div>
        <Paper className={classes.formPaper}>
          <Grid container spacing={3}>
            <Grid item container spacing={1} xs={12}>
              <Grid item xs={12} className={classes.inputHeader}>
                <AppTypography variant="h2">Attendees</AppTypography>
              </Grid>
              <Grid item container spacing={1} xs={12} alignItems="baseline">
                <Grid item xs={12} sm="auto">
                  <AppTypography variant="body1">
                    We plan on having between{" "}
                  </AppTypography>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Box display="flex" alignItems="baseline" flex={1}>
                    <TextField
                      className={classes.attendeesInputs}
                      id="numAttendeesLower"
                      type="number"
                      fullWidth
                      placeholder="25"
                      required
                      value={formik.values.numAttendeesLower}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onKeyPress={preventMinus}
                      InputProps={{inputProps: {min: 5, max: 500}}}
                      error={
                        formik.touched.numAttendeesLower &&
                        formik.errors.numAttendeesLower
                          ? true
                          : false
                      }
                    />
                    <AppTypography variant="body1">and</AppTypography>
                    <TextField
                      className={classes.attendeesInputs}
                      id="numAttendeesUpper"
                      type="number"
                      value={formik.values.numAttendeesUpper}
                      fullWidth
                      placeholder="30"
                      required
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onKeyPress={preventMinus}
                      InputProps={{inputProps: {min: 5, max: 500}}}
                      error={
                        formik.touched.numAttendeesUpper &&
                        formik.errors.numAttendeesUpper
                          ? true
                          : false
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <AppTypography variant="body1">
                    people join us on this retreat
                  </AppTypography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container spacing={3} xs={12}>
              <Grid item container spacing={1} xs={12} sm={6} md={4}>
                <Grid item xs={12} className={classes.inputHeader}>
                  <AppTypography variant="h2">Dates</AppTypography>
                </Grid>
                <Grid item xs={12}>
                  <AppInputToggle
                    value={formik.values.isExactDates}
                    onChange={(val: boolean) => {
                      formik.setFieldValue("isExactDates", val)
                    }}
                    trueOption="Exact"
                    falseOption="I'm flexible"
                  />
                </Grid>
              </Grid>
              {!formik.values.isExactDates && (
                <Grid item container spacing={1} xs={12} sm={6} md={4}>
                  <Grid item xs={12} className={classes.inputHeader}>
                    <AppTypography variant="h2">Number of nights</AppTypography>
                  </Grid>
                  <Grid item xs={12} alignItems="stretch">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="numNights"># nights</InputLabel>
                      <Select
                        label="# nights"
                        id="numNights"
                        required
                        value={formik.values.numNights}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.numNights && formik.errors.numNights
                            ? true
                            : false
                        }>
                        {[
                          {label: "", value: ""},
                          {label: "1 night", value: 1},
                          {label: "2 nights", value: 2},
                          {label: "3 nights", value: 3},
                          {label: "4 nights", value: 4},
                          {label: "5 nights", value: 5},
                          {label: "6 nights", value: 6},
                          {label: "7 nights", value: 7},
                          {label: "8+ nights", value: 8},
                        ].map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </Grid>
            {formik.values.isExactDates ? (
              <Grid item container spacing={1} xs={12}>
                <Grid item xs={12} className={classes.inputHeader}>
                  <AppTypography variant="h2">Timeline</AppTypography>
                </Grid>
                <AppDatePicker
                  startDate={
                    formik.values.startDate
                      ? formik.values.startDate
                      : undefined
                  }
                  endDate={
                    formik.values.endDate ? formik.values.endDate : undefined
                  }
                  onChange={([start, end]) => {
                    formik.setFieldValue("startDate", start ? start : "")
                    formik.setFieldValue("endDate", end ? end : "")
                  }}
                  numCalendars={isSmallScreen ? 1 : 2}
                />
              </Grid>
            ) : (
              <>
                <Grid item container spacing={1} xs={12}>
                  <Grid item xs={12} className={classes.inputHeader}>
                    <AppTypography variant="h2">Preferred months</AppTypography>
                    <AppTypography variant="body1" color="textSecondary">
                      Select all that apply
                    </AppTypography>
                  </Grid>
                  {[thisYear, thisYear + 1].map((year) => {
                    let options =
                      thisYear === year
                        ? [...Array(12 - thisMonth)].map((v, i) =>
                            getOption(i + thisMonth, year)
                          )
                        : [...Array(12)].map((v, i) => getOption(i, year))
                    return (
                      <Grid item container spacing={1} xs={12}>
                        <Grid item xs={12}>
                          <AppTypography variant="h4">{year}</AppTypography>
                        </Grid>
                        <AppInputSelectCardGroup
                          values={
                            formik.values.preferredMonths
                              ? formik.values.preferredMonths
                              : []
                          }
                          options={options}
                          onChange={(val) => {
                            if (formik.values.preferredMonths.includes(val)) {
                              formik.setFieldValue(
                                "preferredMonths",
                                formik.values.preferredMonths.filter(
                                  (v) => val !== v
                                )
                              )
                            } else {
                              formik.setFieldValue("preferredMonths", [
                                ...formik.values.preferredMonths,
                                val,
                              ])
                            }
                          }}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
                <Grid item container spacing={1} xs={12}>
                  <Grid item className={classes.inputHeader} xs={12}>
                    <AppTypography variant="h2">
                      Preferred start date
                    </AppTypography>
                    <AppTypography variant="body1" color="textSecondary">
                      Select all that apply
                    </AppTypography>
                  </Grid>

                  <Grid item xs={12}>
                    <AppInputSelectCardGroup
                      values={formik.values.preferredStartDays}
                      options={[
                        {label: "Mon", value: "Mon"},
                        {label: "Tue", value: "Tue"},
                        {label: "Wed", value: "Wed"},
                        {label: "Thu", value: "Thu"},
                        {label: "Fri", value: "Fri"},
                        {label: "Sat", value: "Sat"},
                        {label: "Sun", value: "Sun"},
                      ]}
                      onChange={(val) => {
                        if (formik.values.preferredStartDays.includes(val)) {
                          formik.setFieldValue(
                            "preferredStartDays",
                            formik.values.preferredStartDays.filter(
                              (v) => val !== v
                            )
                          )
                        } else {
                          formik.setFieldValue("preferredStartDays", [
                            ...formik.values.preferredStartDays,
                            val,
                          ])
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </div>
      <div className={classes.formSection}>
        <div className={classes.formSectionHeader}>
          <AppTypography variant="h4">Any other preferences?</AppTypography>
          <AppTypography variant="body1">
            Let us know your rooming and dining preferences so we can get the
            best and most accurate proposals!
          </AppTypography>
        </div>
        <Paper className={classes.formPaper}>
          <Grid container spacing={3}>
            <Grid item container spacing={1} xs={12} md={6}>
              <Grid item xs={12} className={classes.inputHeader}>
                <AppTypography variant="h2">Meeting space</AppTypography>
                <AppTypography variant="body1" color="textSecondary">
                  Select all that apply
                </AppTypography>
              </Grid>
              <Grid item xs={12}>
                <AppInputSelectLargeCardGroup
                  values={formik.values.meetingSpaces}
                  options={[
                    {
                      label: "Full Company",
                      description: "Meeting space to fit your entire company",
                      value: "company",
                    },
                    {
                      label: "Breakout Rooms",
                      description: "Breakout rooms for smaller groups",
                      value: "breakout",
                    },
                  ]}
                  onChange={(val) => {
                    if (formik.values.meetingSpaces.includes(val)) {
                      formik.setFieldValue(
                        "meetingSpaces",
                        formik.values.meetingSpaces.filter((v) => val !== v)
                      )
                    } else {
                      formik.setFieldValue("meetingSpaces", [
                        ...formik.values.meetingSpaces,
                        val,
                      ])
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={1} xs={12} md={6}>
              <Grid item xs={12} className={classes.inputHeader}>
                <AppTypography variant="h2">Rooming preferences</AppTypography>
                <AppTypography variant="body1" color="textSecondary">
                  Select all that apply
                </AppTypography>
              </Grid>
              <Grid item xs={12}>
                <AppInputSelectLargeCardGroup
                  values={
                    formik.values.roomingPreferences
                      ? formik.values.roomingPreferences
                      : []
                  }
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
                  onChange={(val) => {
                    if (formik.values.roomingPreferences.includes(val)) {
                      formik.setFieldValue(
                        "roomingPreferences",
                        formik.values.roomingPreferences.filter(
                          (v) => val !== v
                        )
                      )
                    } else {
                      formik.setFieldValue("roomingPreferences", [
                        ...formik.values.roomingPreferences,
                        val,
                      ])
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <Grid container justify="center">
        <Grid item xs={10} sm={6} lg={2}>
          <Button
            className={classes.submitButton}
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={disableSubmit}>
            {props.isLoading ? (
              <CircularProgress size={`${0.9375 * 1.75}rem`} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
