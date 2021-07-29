import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, useLocation, withRouter} from "react-router-dom"
import * as yup from "yup"
import LodgingPreferencesEmailForm, {
  LodgingPreferencesEmailFormValues,
} from "../components/forms/LodgingPreferencesEmailForm"
import LodgingPreferencesForm, {
  LodgingPreferencesFormValues,
} from "../components/forms/LodgingPreferencesForm"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import {postLodgingRequestForm} from "../store/actions/lodging"
import {useQuery} from "../utils"

type LodgingFormPageProps = RouteComponentProps<{}>
function LodgingFormPage(props: LodgingFormPageProps) {
  let dispatch = useDispatch()
  let email = useQuery("email")
  let location = useLocation()
  let [isValidEmail, setIsValidEmail] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    setIsValidEmail(yup.string().required().email().isValidSync(email))
  }, [email, setIsValidEmail])

  function submitEmailForm(values: LodgingPreferencesEmailFormValues) {
    let searchParams = new URLSearchParams(location.search)
    searchParams.set("email", values.email)
    dispatch(push({...location, search: searchParams.toString()}))
  }

  function submitLodgingPreferencesForm(
    values: LodgingPreferencesFormValues,
    resetForm: () => void
  ) {
    dispatch(
      postLodgingRequestForm(
        resetForm,
        email ? email : "", // page + submission should be blocked by email modal unless email non-null
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
          header: "Lodging Form",
        }}>
        {!isValidEmail && (
          <LodgingPreferencesEmailForm submitValues={submitEmailForm} />
        )}
        <LodgingPreferencesForm
          submitLodgingPreferencesForm={submitLodgingPreferencesForm}
        />
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingFormPage)
