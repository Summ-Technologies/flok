import {useEffect} from "react"
import {useMixPanel} from "react-mixpanel-provider-component"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import LodgingPreferencesForm, {
  LodgingPreferencesFormValues,
} from "../components/forms/LodgingPreferencesForm"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import {RootState} from "../store"
import {postLodgingRequestForm} from "../store/actions/lodging"
import {useQuery} from "../utils"

type LodgingFormPageProps = RouteComponentProps<{}>
function LodgingFormPage(props: LodgingFormPageProps) {
  let dispatch = useDispatch()
  const {mixpanel} = useMixPanel()
  let postRfpRequestState = useSelector(
    (state: RootState) => state.api.postRfpForm
  )
  let email = useQuery("email")

  useEffect(() => {
    mixpanel.track("LODGING_FORM_START")
  }, [mixpanel])

  function submitLodgingPreferencesForm(
    values: LodgingPreferencesFormValues,
    resetForm: () => void
  ) {
    let onSuccess = () => {
      mixpanel.track("LODGING_FORM_SUBMITTED")
      resetForm()
    }
    dispatch(
      postLodgingRequestForm(
        onSuccess,
        values.email,
        values.companyName,
        values.numAttendeesUpper ? values.numAttendeesUpper : 0,
        values.numAttendeesLower ? values.numAttendeesLower : 0,
        !values.isExactDates,
        values.meetingSpaces,
        values.roomingPreferences,
        values.numNights ? values.numNights : undefined,
        values.preferredMonths,
        values.preferredStartDays,
        values.startDate ? values.startDate : undefined,
        values.endDate ? values.endDate : undefined
      )
    )
  }
  return (
    <PageContainer>
      <PageBody
        HeaderProps={{
          header: "You've taken the first step in planning your retreat!",
        }}>
        <LodgingPreferencesForm
          prefilledEmail={email ? email : undefined}
          submitLodgingPreferencesForm={submitLodgingPreferencesForm}
          isLoading={postRfpRequestState.loading}
        />
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingFormPage)
