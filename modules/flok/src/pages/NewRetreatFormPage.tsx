import {Box} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect} from "react"
import {useMixPanel} from "react-mixpanel-provider-component"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import {
  NewRetreatForm,
  NewRetreatFormValues,
} from "../components/lodging/LodgingForms"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {closeSnackbar, enqueueSnackbar} from "../notistack-lib/actions"
import {apiNotification} from "../notistack-lib/utils"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {postNewRetreat} from "../store/actions/retreat"

type NewRetreatFormPageProps = RouteComponentProps<{}>
function NewRetreatFormPage(props: NewRetreatFormPageProps) {
  let dispatch = useDispatch()
  let newRetreatFormLoading = useSelector(
    (state: RootState) => state.api.newRetreatFormLoading
  )

  const {mixpanel} = useMixPanel()
  useEffect(() => {
    mixpanel.track("LODGING_FORM_START")
  }, [mixpanel])

  function submitNewRetreat(values: NewRetreatFormValues) {
    let onSuccess = (guid: string) => {
      dispatch(
        push(
          AppRoutes.getPath("RetreatPreferencesFormPage", {retreatGuid: guid})
        )
      )
    }
    dispatch(
      postNewRetreat(values.name, values.email, values.companyName, onSuccess)
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
    <PageContainer
      backgroundImage={
        "https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg"
      }>
      <PageBody>
        <PageOverlay>
          <Box paddingBottom={4}>
            <PageHeader
              preHeader={<AppLodgingFlowTimeline currentStep="INTAKE_1" />}
              header="Let's Get Started"
              subheader="We need just a few details to plan your perfect retreat."
            />
          </Box>
          <NewRetreatForm
            onSubmit={submitNewRetreat}
            onError={showError}
            isLoading={newRetreatFormLoading}
          />
        </PageOverlay>
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(NewRetreatFormPage)
