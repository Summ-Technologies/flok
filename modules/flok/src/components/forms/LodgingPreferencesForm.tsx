import {Button, FormControl, makeStyles, Paper, Select} from "@material-ui/core"
import {useFormik} from "formik"
import {useEffect, useState} from "react"
import * as yup from "yup"
import AppTypography from "../base/AppTypography"
import AppDatePicker from "../lodging/AppDateRangePicker"
import AppInputSelectCardGroup from "../lodging/AppInputSelectCardGroup"
import AppInputSelectLargeCardGroup from "../lodging/AppInputSelectLargeCardGroup"
import AppInputToggle from "../lodging/AppInputToggle"

const useStyles = makeStyles((theme) => ({
  selectDestinationInput: {
    "& .MuiAutocomplete-inputRoot": {
      paddingRight: "9px !important",
    },
  },
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
  },
  formPaperRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    "&:not(:first-child)": {
      marginTop: theme.spacing(4),
    },
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    "&:not(:first-child)": {
      marginLeft: theme.spacing(4),
    },
    minWidth: 0,
  },
  inputHeader: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: theme.spacing(2),
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
    "& *": {
      lineHeight: 1,
    },
  },
}))

export type LodgingPreferencesFormValues = {
  numAttendees: number | ""
  isExactDates: boolean
  meetingSpaces: string[]
  roomingPreferences: string[]

  // exact dates

  // i'm flexible
  numNights?: number
  preferredMonths: string[]
  preferredStartDays: string[]
}

let LodgingPreferencesCommonFormSchema = yup.object().shape({
  numAttendees: yup.number().positive().required("This field is required."),
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
  submitLodgingPreferencesForm: (values: LodgingPreferencesFormValues) => void
}

export default function LodgingPreferencesForm(
  props: LodgingPreferencesFormProps
) {
  const classes = useStyles()
  let formik = useFormik<LodgingPreferencesFormValues>({
    initialValues: {
      numAttendees: "",
      isExactDates: false,
      preferredMonths: [],
      preferredStartDays: [],
      meetingSpaces: [],
      roomingPreferences: [],
    },
    validationSchema: LodgingPreferencesCommonFormSchema,
    onSubmit: props.submitLodgingPreferencesForm,
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
          <div className={classes.formPaperRow}>
            <div className={classes.inputContainer}>
              <div className={classes.inputHeader}>
                <AppTypography variant="h5">Attendees</AppTypography>
                <AppTypography variant="body1" color="textSecondary">
                  # employees attending
                </AppTypography>
              </div>
              <FormControl>
                <Select
                  id="numAttendees"
                  variant="outlined"
                  required
                  value={formik.values.numAttendees}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.numAttendees && formik.errors.numAttendees
                      ? true
                      : false
                  }>
                  {[
                    {label: "1 employees", value: "1"},
                    {label: "2 employees", value: "2"},
                    {label: "3 employees", value: "3"},
                    {label: "4 employees", value: "4"},
                    {label: "5 employees", value: "5"},
                    {label: "6 employees", value: "6"},
                    {label: "7 employees", value: "7"},
                    {label: "8 employees", value: "8"},
                    {label: "9 employees", value: "9"},
                  ].map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className={classes.inputContainer}>
              <div className={classes.inputHeader}>
                <AppTypography variant="h5">Dates</AppTypography>

                <AppTypography variant="body1" color="textSecondary">
                  Select your retreat dates
                </AppTypography>
              </div>
              <AppInputToggle
                value={formik.values.isExactDates}
                onChange={(val: boolean) => {
                  formik.setFieldValue("isExactDates", val)
                }}
                trueOption="Exact"
                falseOption="I'm flexible"
              />
            </div>
            <div className={classes.inputContainer}>
              <div className={classes.inputHeader}>
                <AppTypography variant="h5">Number of nights</AppTypography>
              </div>
              <FormControl>
                <Select
                  variant="outlined"
                  id="numNights"
                  required
                  value={formik.values.numNights}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.numAttendees && formik.errors.numAttendees
                      ? true
                      : false
                  }>
                  {[
                    {label: "1 night", value: "1"},
                    {label: "2 nights", value: "2"},
                    {label: "3 nights", value: "3"},
                    {label: "4 nights", value: "4"},
                    {label: "5 nights", value: "5"},
                    {label: "6 nights", value: "6"},
                    {label: "7 nights", value: "7"},
                    {label: "8+ nights", value: "8"},
                  ].map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          {formik.values.isExactDates ? (
            <div className={classes.formPaperRow}>
              <div className={classes.inputContainer}>
                <div className={classes.inputHeader}>
                  <AppTypography variant="h5">Timeline</AppTypography>
                </div>
                <AppDatePicker />
              </div>
            </div>
          ) : (
            <>
              <div className={classes.formPaperRow}>
                <div className={classes.inputContainer}>
                  <div className={classes.inputHeader}>
                    <AppTypography variant="h5">Preferred months</AppTypography>

                    <AppTypography variant="body1" color="textSecondary">
                      Select all that apply
                    </AppTypography>
                  </div>
                  <AppInputSelectCardGroup
                    values={
                      formik.values.preferredMonths
                        ? formik.values.preferredMonths
                        : []
                    }
                    options={[
                      {label: "Jan", value: "1"},
                      {label: "Feb", value: "2"},
                      {label: "Mar", value: "3"},
                      {label: "Apr", value: "4"},
                      {label: "May", value: "5"},
                      {label: "Jun", value: "6"},
                      {label: "Jul", value: "7"},
                      {label: "Aug", value: "8"},
                      {label: "Sep", value: "9"},
                      {label: "Oct", value: "10"},
                      {label: "Nov", value: "11"},
                      {label: "Dec", value: "12"},
                      {label: "Nov", value: "13"},
                      {label: "Dec", value: "14"},
                      {label: "Nov", value: "15"},
                      {label: "Dec", value: "16"},
                    ]}
                    onChange={(val) => {
                      if (formik.values.preferredMonths.includes(val)) {
                        formik.setFieldValue(
                          "preferredMonths",
                          formik.values.preferredMonths.filter((v) => val !== v)
                        )
                      } else {
                        formik.setFieldValue("preferredMonths", [
                          ...formik.values.preferredMonths,
                          val,
                        ])
                      }
                    }}
                  />
                </div>
              </div>
              <div className={classes.formPaperRow}>
                <div className={classes.inputContainer}>
                  <div className={classes.inputHeader}>
                    <AppTypography variant="h5">
                      Preferred start date
                    </AppTypography>

                    <AppTypography variant="body1" color="textSecondary">
                      Select all that apply
                    </AppTypography>
                  </div>
                  <AppInputSelectCardGroup
                    values={formik.values.preferredStartDays}
                    options={[
                      {label: "Mon", value: "1"},
                      {label: "Tue", value: "2"},
                      {label: "Wed", value: "3"},
                      {label: "Thu", value: "4"},
                      {label: "Fri", value: "5"},
                      {label: "Sat", value: "6"},
                      {label: "Sun", value: "7"},
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
                </div>
              </div>
            </>
          )}
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
          <div className={classes.formPaperRow}>
            <div className={classes.inputContainer}>
              <div className={classes.inputHeader}>
                <AppTypography variant="h5">Meeting space</AppTypography>

                <AppTypography variant="body1" color="textSecondary">
                  Select all that apply
                </AppTypography>
              </div>
              <AppInputSelectLargeCardGroup
                values={formik.values.meetingSpaces}
                options={[
                  {
                    label: "Double",
                    value: "single",
                    description: "this is on a monday! best one",
                  },
                  {
                    label: "Double",
                    value: "double",
                    description: "this is on a monday! best one",
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
            </div>
            <div className={classes.inputContainer}>
              <div className={classes.inputHeader}>
                <AppTypography variant="h5">Rooming preferences</AppTypography>
                <AppTypography variant="body1" color="textSecondary">
                  Select all that apply
                </AppTypography>
              </div>
              <AppInputSelectLargeCardGroup
                values={
                  formik.values.roomingPreferences
                    ? formik.values.roomingPreferences
                    : []
                }
                options={[
                  {
                    label: "Double",
                    value: "single",
                    description: "this is on a monday! best one",
                  },
                  {
                    label: "Double",
                    value: "double",
                    description: "this is on a monday! best one",
                  },
                ]}
                onChange={(val) => {
                  if (formik.values.roomingPreferences.includes(val)) {
                    formik.setFieldValue(
                      "roomingPreferences",
                      formik.values.roomingPreferences.filter((v) => val !== v)
                    )
                  } else {
                    formik.setFieldValue("roomingPreferences", [
                      ...formik.values.roomingPreferences,
                      val,
                    ])
                  }
                }}
              />
            </div>
          </div>
        </Paper>
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={disableSubmit}>
        Submit
      </Button>
    </form>
  )
}
