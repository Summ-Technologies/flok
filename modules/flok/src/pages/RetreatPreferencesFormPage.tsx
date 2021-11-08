import {Box} from "@material-ui/core"
import {useEffect} from "react"
import TagManager from "react-gtm-module"
import {useMixPanel} from "react-mixpanel-provider-component"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
import {
  RetreatPreferencesForm,
  RetreatPreferencesFormValues,
} from "../components/lodging/LodgingForms"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {RetreatModel} from "../models/retreat"
import {closeSnackbar, enqueueSnackbar} from "../notistack-lib/actions"
import {apiNotification} from "../notistack-lib/utils"
import {RootState} from "../store"
import {updateRetreatPreferences} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import {useRetreat} from "../utils/lodgingUtils"

type RetreatPreferencesFormPageProps = RouteComponentProps<{
  retreatGuid: string
}>
function RetreatPreferencesFormPage(props: RetreatPreferencesFormPageProps) {
  // Setup
  let dispatch = useDispatch()

  // Path params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useRetreat(retreatGuid)

  let retreatPreferencesFormLoading = useSelector(
    (state: RootState) => state.api.retreatPreferencesFormLoading
  )

  // analytics
  const {mixpanel} = useMixPanel()
  useEffect(() => {
    mixpanel.track("LODGING_FORM_START")
  }, [mixpanel])

  // Action handlers
  function submitRetreatPreferences(values: RetreatPreferencesFormValues) {
    if (retreat && retreat !== ResourceNotFound) {
      let onSuccess = () => {
        mixpanel.track("LODGING_FORM_SUBMITTED")
        let q = new URLSearchParams({
          email: (retreat as RetreatModel).contact_email,
          a1: (retreat as RetreatModel).company_name,
          utm_campaign: "intake_call",
          utm_content: (retreat as RetreatModel).id.toString(),
        }).toString()

        TagManager.dataLayer({
          dataLayer: {
            event: "INTAKE_FORM_SUBMITTED",
          },
        })
        window.location.href = `https://calendly.com/flok_sales/flok-intro-call?${q}`
      }
      dispatch(
        updateRetreatPreferences(
          retreatGuid,
          values.isFlexibleDates,
          values.attendeesLower,
          undefined,
          values.flexibleNumNights,
          values.flexibleMonths,
          values.flexibleStartDow,
          values.exactStartDate,
          values.exactEndDate,
          onSuccess
        )
      )
    }
  }

  function showError(error: string) {
    dispatch(
      enqueueSnackbar(
        apiNotification(error, (key) => dispatch(closeSnackbar(key)), true)
      )
    )
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageBody>
          <PageOverlay
            right={
              <AppPageSpotlightImage
                imageUrl="https://flok-b32d43c.s3.amazonaws.com/hotels/fairmont_sidebar.png"
                imageAlt="Fairmont Austin pool overview in the evening"
                imagePosition="bottom-right"
              />
            }>
            <Box paddingBottom={4}>
              <PageHeader
                preHeader={<AppLodgingFlowTimeline currentStep="INTAKE_2" />}
                header="Let's Get Started"
                subheader="We need just a few details to plan your perfect retreat."
              />
            </Box>
            <RetreatPreferencesForm
              onSubmit={submitRetreatPreferences}
              onError={showError}
              isLoading={retreatPreferencesFormLoading}
            />
          </PageOverlay>
        </PageBody>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(RetreatPreferencesFormPage)
