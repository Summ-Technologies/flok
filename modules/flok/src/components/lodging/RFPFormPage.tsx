import {Button, FormHelperText, makeStyles, TextField} from "@material-ui/core"
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab"
import clsx from "clsx"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import {useDispatch} from "react-redux"
import * as yup from "yup"
import {AgendaType} from "../../models/retreat"
import RedirectPage from "../../pages/misc/RedirectPage"
import {useRetreat} from "../../pages/misc/RetreatProvider"
import {ApiAction} from "../../store/actions/api"
import {postRFP} from "../../store/actions/retreat"
import {getTextFieldErrorProps, useQuery} from "../../utils"
import AppTypography from "../base/AppTypography"
import PageBody from "../page/PageBody"
import PageHeader from "../page/PageHeader"
import RFPDatesInput from "./RFPDatesRangeInput"

let useStyles = makeStyles((theme) => ({
  errorAgendaTypes: {
    borderColor: theme.palette.error.main,
  },
  agendaTypeErrorMessage: {
    marginLeft: theme.spacing(3),
  },
}))
function RFPFormPage() {
  let dispatch = useDispatch()
  let classes = useStyles()
  let toDate = (dt?: Date) =>
    dt
      ? dt.toISOString().substring(0, dt.toISOString().indexOf("T"))
      : undefined

  let [retreat, retreatIdx] = useRetreat()
  let [next] = useQuery("next")
  let minPlanningDate = new Date()
  minPlanningDate.setDate(minPlanningDate.getDate() + 90)

  let formik = useFormik({
    validationSchema: yup.object().shape({
      number_of_rooms: yup
        .number()
        .required("Number of rooms is required.")
        .min(1, "At least 1 room is required."),
      has_exact_dates: yup.boolean().required(),
      exact_dates_start: yup.date().when("has_exact_dates", {
        is: true,
        then: yup.date().required("Start date is required."),
      }),
      exact_dates_end: yup.date().when("has_exact_dates", {
        is: true,
        then: yup.date().required("End date is required."),
      }),
      flexible_number_of_nights: yup.number().when("has_exact_dates", {
        is: false,
        then: yup
          .number()
          .required("Number of nights is required.")
          .min(1, "At least one night required."),
      }),
      agenda_type: yup.string().required("Agenda type is required."),
    }),
    initialValues: {
      has_exact_dates: true,
      exact_dates_start: undefined,
      exact_dates_end: undefined,
      flexible_number_of_nights: 0,
      exact_dates_notes: "",
      flexible_dates_notes: "",
      agenda_type: "",
      agenda_notes: "",
      number_of_rooms: undefined,
    },
    onSubmit: async (values) => {
      let response = dispatch(
        postRFP({
          ...values,
          retreat_id: retreat.id,
          exact_dates_start: toDate(values.exact_dates_start),
          exact_dates_end: toDate(values.exact_dates_end),
          agenda_type: values.agenda_type as AgendaType,
        })
      ) as unknown as ApiAction
      if (!response.error && next) {
        dispatch(push(decodeURIComponent(next)))
      }
    },
  })
  if (retreat.request_for_proposal) {
    return (
      <RedirectPage
        pageName="HotelSourcingPage"
        pathParams={{retreatIdx: retreatIdx.toString()}}
      />
    )
  }
  console.log(formik.errors)
  return (
    <PageBody appBar>
      <div style={{margin: 16}}>
        <PageHeader
          header={
            <AppTypography variant="h1" fontWeight="bold">
              RFP
            </AppTypography>
          }
          subheader="It is ok if some of this information has not been confirmed yet.  You will be able to make changes before signing a formal contract"
        />
        <form onSubmit={formik.handleSubmit}>
          <div style={{marginLeft: 8}}>
            <div style={{display: "flex", marginTop: 40, alignItems: "center"}}>
              <AppTypography fontWeight="bold">
                1. How many guest rooms do you need each night?
              </AppTypography>
              <TextField
                style={{marginLeft: "auto", marginRight: "25%"}}
                value={formik.values.number_of_rooms}
                id="number_of_rooms"
                onChange={formik.handleChange}
                type="number"
                {...getTextFieldErrorProps(
                  formik,
                  "number_of_rooms"
                )}></TextField>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 32,
                alignItems: "center",
                gap: 8,
              }}>
              <AppTypography fontWeight="bold">
                2. Tell us a little bit about when you are planning to go.
              </AppTypography>
              <div style={{marginLeft: "auto", marginRight: "20%"}}>
                <RFPDatesInput
                  error={
                    !!(
                      formik.errors.exact_dates_start ||
                      formik.errors.exact_dates_end ||
                      formik.errors.has_exact_dates ||
                      formik.errors.flexible_number_of_nights
                    )
                  }
                  onChangeExactDatesNotes={(newNotes) => {
                    formik.setFieldValue("exact_dates_notes", newNotes)
                  }}
                  onChangeFlexibleDatesNotes={(newNotes) => {
                    formik.setFieldValue("flexible_dates_notes", newNotes)
                  }}
                  exactDatesNotes={formik.values.exact_dates_notes}
                  flexibleDatesNotes={formik.values.flexible_dates_notes}
                  isExactDates={formik.values.has_exact_dates}
                  onChangeIsExactDates={(isExact) => {
                    formik.setFieldValue("has_exact_dates", isExact)
                  }}
                  start={formik.values.exact_dates_start}
                  end={formik.values.exact_dates_end}
                  onChangeDateRange={(start, end) => {
                    formik.setFieldValue("exact_dates_start", start)
                    formik.setFieldValue("exact_dates_end", end)
                  }}
                  onChangeNumNights={(numNights) => {
                    formik.setFieldValue("flexible_number_of_nights", numNights)
                  }}
                  numNights={formik.values.flexible_number_of_nights}
                />
              </div>
            </div>
            <div style={{marginTop: 32, display: "flex", alignItems: "center"}}>
              <div>
                <AppTypography fontWeight="bold">
                  3. Choose the Agenda which best matches your planned
                  itinerary.
                </AppTypography>
                <AppTypography
                  style={{marginLeft: 24, marginTop: 4}}
                  fontWeight="light">
                  Venues need to get a sense of how much meeting space you will
                  need
                </AppTypography>
              </div>
              <div>
                <ToggleButtonGroup
                  style={{marginLeft: 16}}
                  orientation="horizontal"
                  value={formik.values.agenda_type}
                  id="agenda_type"
                  exclusive
                  onChange={(e, newValue) => {
                    formik.setFieldValue("agenda_type", newValue)
                  }}>
                  <ToggleButton
                    value="ALL_WORK"
                    aria-label="list"
                    className={clsx(
                      !!formik.errors.agenda_type && classes.errorAgendaTypes
                    )}>
                    All Work
                  </ToggleButton>
                  <ToggleButton
                    value="ALL_PLAY"
                    aria-label="module"
                    className={clsx(
                      !!formik.errors.agenda_type && classes.errorAgendaTypes
                    )}>
                    All Play
                  </ToggleButton>
                  <ToggleButton
                    value="WORK_AND_PLAY"
                    aria-label="quilt"
                    className={clsx(
                      !!formik.errors.agenda_type && classes.errorAgendaTypes
                    )}>
                    Work & Play
                  </ToggleButton>
                </ToggleButtonGroup>
                {!!formik.errors.agenda_type && (
                  <FormHelperText
                    error
                    className={classes.agendaTypeErrorMessage}>
                    {formik.errors.agenda_type}
                  </FormHelperText>
                )}
              </div>
            </div>
            <div style={{marginTop: 16, marginLeft: "5%"}}>
              <TextField
                value={formik.values.agenda_notes}
                onChange={formik.handleChange}
                id="agenda_notes"
                multiline
                placeholder="What else should we know about your agenda?"
                rows={4}
                variant="outlined"
                fullWidth
                style={{
                  marginLeft: "auto",
                  maxWidth: "80%",
                  marginRight: "auto",
                }}
              />
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{float: "right", marginTop: 16, marginRight: "10%"}}>
            Submit
          </Button>
        </form>
      </div>
    </PageBody>
  )
}
export default RFPFormPage
