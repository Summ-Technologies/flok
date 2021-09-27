import {Box, Button, makeStyles, FormControl, FormLabel, FormControlLabel, Paper, InputAdornment, Grid, RadioGroup, Radio, TextField} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter, useParams} from "react-router-dom"
import AppLogo from "../components/base/AppLogo"
import AppTypography from "../components/base/AppTypography"
import {useFormik} from "formik"
import {closeSnackbar, enqueueSnackbar} from "../notistack-lib/actions"
import {apiNotification} from "../notistack-lib/utils"
import PageHeader from "../components/page/PageHeader"
import {postRFPLiteResponse} from "../store/actions/lodging"
import {getRFPLiteRequest} from "../store/actions/rfp_lite_request"
import {RootState} from "../store"
import {useQuery} from "../utils"
import * as yup from "yup"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    margin: theme.spacing(14)
  },
  notes: {
    display: "flex",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
  }
}))

type RFPLiteResponsePageProps = RouteComponentProps<{}>
function RFPLiteResponsePage(props: RFPLiteResponsePageProps) {
  let classes = useStyles(props)
  let params = useParams() as any
  let dispatch = useDispatch()
  let availability = useQuery("avail")
  let rfpLiteRequestGuid = params.guid
  const [availValue, setAvailValue] = useState(useQuery('avail'))

  let rfpLiteRequest = useSelector((state:RootState) => state.rfp_lite.rfp_lite_request);

  useEffect(() => {
    if (rfpLiteRequest === undefined) {
      dispatch(getRFPLiteRequest(rfpLiteRequestGuid))
    }
  }, [dispatch, rfpLiteRequest])

  useEffect(() => {
    function postResponse() {
      if (
        rfpLiteRequestGuid &&
        availability
      ) {
        dispatch(
          postRFPLiteResponse(
            rfpLiteRequestGuid,
            availability
          )
        )
      }
    }
    postResponse()
  }, [availability, rfpLiteRequestGuid, dispatch])

  let FormValidation = yup.object().shape({
    availability: yup.string().required(""),
    rohRate: yup.number(),
    notes: yup.string(),
  })

  let formik = useFormik({
    validationSchema: FormValidation,
    initialValues: {
      availability: availValue,
      rohRate: '',
      notes: ''
    },
    onSubmit: (vals) => {
      dispatch(
        postRFPLiteResponse(
          rfpLiteRequestGuid,
          vals.availability,
          vals.rohRate,
          vals.notes
        )
      )
    },
  })

  function showError(error: string) {
    dispatch(
      enqueueSnackbar(
        apiNotification(error, (key) => dispatch(closeSnackbar(key)), true)
      )
    )
  }


  return (
    <Paper className={classes.root}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <AppLogo height={40} noBackground />
            <PageHeader
              header="Thanks for your response!"
              subheader="Help us understand if this client might be a good fit for your hotel"
            />

            <AppTypography>Request Details</AppTypography>
            {typeof rfpLiteRequest !== "undefined" &&
              <>
                <p><strong>Client</strong>: {rfpLiteRequest.client_name}</p>
                <p><strong>Dates</strong>: {rfpLiteRequest.dates}</p>
                <p><strong>Length</strong>: {rfpLiteRequest.length}</p>
                <p><strong>Meeting Space</strong>: {rfpLiteRequest.meeting_space}</p>
                <p><strong>Number of Guests</strong>: {rfpLiteRequest.number_of_guests}</p>
              </>
            }
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Availability</FormLabel>
                {typeof availValue === "string" &&
                  <RadioGroup aria-label="availability" name="availability"
                    value={formik.values.availability}
                    onChange={formik.handleChange}
                    >
                    <FormControlLabel value="true" control={<Radio />} label="Yes, I have availability" />
                    <FormControlLabel value="maybe" control={<Radio />} label="Maybe" />
                    <FormControlLabel value="false" control={<Radio />} label="No Availability" />
                  </RadioGroup>
                }
              </FormControl>
            </Grid>
            {formik.values.availability != "false" &&
            <Grid xs={12}>
              <FormControl component="fieldset">
                <AppTypography fontWeight="bold">
                  Estimate Lowest Commisionable Run Of House Rate:
                </AppTypography>
                <TextField
                  id="rohRate"
                  name="rohRate"
                  value={formik.values.rohRate}
                  onChange={formik.handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  variant="outlined"
                  error={formik.touched.rohRate && Boolean(formik.errors.rohRate)}
                  fullWidth
                />
              </FormControl>
            </Grid>
            }
            <Grid xs={12}>
              <FormControl className={classes.notes}>
                <TextField
                  id="notes"
                  name="notes"
                  label="Notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className={classes.saveButton}>
          <Button type="submit"
            variant="contained" color="primary" size="large"
            onClick={() => {
              Object.values(formik.errors)
                .forEach((err) => {
                  if (typeof err === "string") {
                    showError(err)
                  }
                })
              }
            }
          >
            Save
          </Button>
        </Grid>
      </form>
    </Paper>
  )
}
export default withRouter(RFPLiteResponsePage)
