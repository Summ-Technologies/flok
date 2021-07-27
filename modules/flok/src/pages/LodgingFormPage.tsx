import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import LodgingPreferencesForm, {
  LodgingPreferencesFormValues,
} from "../components/forms/LodgingPreferencesForm"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import {postLodgingRequestForm} from "../store/actions/lodging"

type LodgingFormPageProps = RouteComponentProps<{}>
function LodgingFormPage(props: LodgingFormPageProps) {
  let dispatch = useDispatch()
  let submitLodgingPreferencesForm = (values: LodgingPreferencesFormValues) => {
    dispatch(
      postLodgingRequestForm(
        values.numAttendees ? values.numAttendees : 0,
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
          header: "Lodging Form",
        }}>
        <LodgingPreferencesForm
          submitLodgingPreferencesForm={submitLodgingPreferencesForm}
        />
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingFormPage)
