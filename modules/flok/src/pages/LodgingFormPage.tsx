import {Grid, makeStyles} from "@material-ui/core"
import querystring from "querystring"
import {useEffect} from "react"
import {useMixPanel} from "react-mixpanel-provider-component"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import LodgingPreferencesForm, {
  RFPFormValues,
} from "../components/lodging/LodgingPreferencesForm"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import {closeSnackbar, enqueueSnackbar} from "../notistack-lib/actions"
import {apiNotification} from "../notistack-lib/utils"
import {RootState} from "../store"
import {postLodgingRequestForm} from "../store/actions/lodging"

const useStyles = makeStyles((theme) => ({
  formContainer: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    height: "100%",
  },
}))

type LodgingFormPageProps = RouteComponentProps<{}>
function LodgingFormPage(props: LodgingFormPageProps) {
  const classes = useStyles()

  let postRfpRequestState = useSelector(
    (state: RootState) => state.api.postRfpForm
  )

  const {mixpanel} = useMixPanel()
  useEffect(() => {
    mixpanel.track("LODGING_FORM_START")
  }, [mixpanel])

  let dispatch = useDispatch()
  function submitLodgingPreferencesForm(values: RFPFormValues) {
    let onSuccess = (id: number) => {
      mixpanel.track("LODGING_FORM_SUBMITTED")
      let q = querystring.stringify({
        email: values.email,
        a1: values.companyName,
        utm_campaign: "intake_call",
        utm_content: id,
      })
      window.location.href = `https://calendly.com/flok_sales/flok-intro-call?${q}`
    }
    dispatch(
      postLodgingRequestForm(
        onSuccess,
        values.email ? values.email : "",
        values.companyName ? values.companyName : "",
        values.attendeesUpper ? values.attendeesUpper : 0,
        values.attendeesLower ? values.attendeesLower : 0,
        !values.isExactDates,
        values.meetingSpaces ? values.meetingSpaces : [],
        values.roomingType ? [values.roomingType] : [],
        values.numNights ? values.numNights : undefined,
        values.preferredMonths,
        [],
        values.startDate ? values.startDate : undefined,
        values.endDate ? values.endDate : undefined,
        values.budget
      )
    )
  }

  function showError(error: string) {
    dispatch(
      enqueueSnackbar(
        apiNotification(error, (key) => dispatch(closeSnackbar(key)), true)
      )
    )
  }

  return (
    <PageContainer>
      <PageBody
        noGutter
        backgroundImage={
          "https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg"
        }>
        <Grid container className={classes.formContainer}>
          <Grid item xs={11} sm={10} md={9} lg={7}>
            <LodgingPreferencesForm
              onSubmit={submitLodgingPreferencesForm}
              onError={showError}
              isLoading={postRfpRequestState.loading}
            />
          </Grid>
        </Grid>
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingFormPage)
