import {Box} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import TagManager from "react-gtm-module"
import {useMixPanel} from "react-mixpanel-provider-component"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../../components/lodging/AppPageSpotlightImage"
import {
  RetreatPreferencesForm,
  RetreatPreferencesFormValues,
} from "../../components/lodging/LodgingForms"
import PageBody from "../../components/page/PageBody"
import PageContainer from "../../components/page/PageContainer"
import PageHeader from "../../components/page/PageHeader"
import PageOverlay from "../../components/page/PageOverlay"
import {ResourceNotFound, ResourceNotFoundType} from "../../models"
import {RetreatModel} from "../../models/retreat"
import {closeSnackbar, enqueueSnackbar} from "../../notistack-lib/actions"
import {apiNotification} from "../../notistack-lib/utils"
import {AppRoutes} from "../../Stack"
import {RootState} from "../../store"
import {updateRetreatPreferences} from "../../store/actions/retreat"
import {useQuery} from "../../utils"

type RetreatPreferencesFormPageProps = RouteComponentProps<{
  retreatGuid: string
}>
function RetreatPreferencesFormPage(props: RetreatPreferencesFormPageProps) {
  // Setup
  let dispatch = useDispatch()

  // Path params
  // let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreatId = 1
  let retreat: RetreatModel | ResourceNotFoundType = ResourceNotFound

  let retreatPreferencesFormLoading = useSelector(
    (state: RootState) => state.api.retreatPreferencesFormLoading
  )

  // Query param for last page (used when retreatState > INTAKE_2)
  let [lastQueryParam] = useQuery("last")
  let [previouslyCompleted, setPreviouslyCompleted] = useState(false)
  let [prefilledValues, setPrefilledValues] = useState<
    Partial<RetreatPreferencesFormValues>
  >({})

  useEffect(() => {
    let initValues: Partial<RetreatPreferencesFormValues> = {}
    if (retreat && retreat !== ResourceNotFound) {
      if (retreat.preferences_dates_exact_end) {
        let ds = retreat.preferences_dates_exact_end
          .split(/\D/)
          .map((s) => parseInt(s))
        if (ds.length >= 3) {
          ds[1] = ds[1] - 1
          initValues.exactEndDate = new Date(ds[0], ds[1], ds[2])
        }
      }
      if (retreat.preferences_dates_exact_start) {
        let ds = retreat.preferences_dates_exact_start
          .split(/\D/)
          .map((s) => parseInt(s))
        if (ds.length >= 3) {
          ds[1] = ds[1] - 1
          initValues.exactStartDate = new Date(ds[0], ds[1], ds[2])
        }
      }
      if (retreat.preferences_is_dates_flexible != null) {
        initValues.isFlexibleDates = retreat.preferences_is_dates_flexible
      }
      if (retreat.preferences_dates_flexible_months) {
        initValues.flexibleMonths = retreat.preferences_dates_flexible_months
      }
      if (retreat.preferences_num_attendees_lower) {
        initValues.attendeesLower = retreat.preferences_num_attendees_lower
      }
      if (retreat.preferences_dates_flexible_num_nights != null) {
        initValues.flexibleNumNights =
          retreat.preferences_dates_flexible_num_nights
      }
    }
    setPrefilledValues(initValues)
  }, [retreat, setPrefilledValues])

  useEffect(() => {
    if (
      retreat &&
      retreat !== ResourceNotFound &&
      retreat.state !== "INTAKE_2"
    ) {
      setPreviouslyCompleted(true)
    }
  }, [retreat, setPreviouslyCompleted])

  // analytics
  const {mixpanel} = useMixPanel()
  useEffect(() => {
    if (!previouslyCompleted) {
      mixpanel.track("LODGING_FORM_START")
    }
  }, [mixpanel, previouslyCompleted])

  // Action handlers
  function submitRetreatPreferences(values: RetreatPreferencesFormValues) {
    if (retreat && retreat !== ResourceNotFound) {
      let onSuccess = () => {
        if (!previouslyCompleted) {
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
          window.location.href = `https://calendly.com/flok_sales/flok-intro-call-1?${q}`
        } else {
          dispatch(
            push(
              lastQueryParam ??
                AppRoutes.getPath("RetreatFiltersPage", {
                  retreaftIdx: retreatId.toString(),
                })
            )
          )
        }
      }
      dispatch(
        updateRetreatPreferences(
          retreatId,
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
              preHeader={<AppLodgingFlowTimeline currentStep={"INTAKE_2"} />}
              header="Let's Get Started"
              subheader="We need just a few details to plan your perfect retreat."
            />
          </Box>
          <RetreatPreferencesForm
            onSubmit={submitRetreatPreferences}
            onError={showError}
            isLoading={retreatPreferencesFormLoading}
            initialVals={prefilledValues}
            submitButtonText={
              previouslyCompleted ? "Update" : "Start planning!"
            }
          />
        </PageOverlay>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatPreferencesFormPage)
