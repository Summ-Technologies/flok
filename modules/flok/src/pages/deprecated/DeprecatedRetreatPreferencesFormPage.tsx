import {Box, Typography} from "@material-ui/core"
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
import {ResourceNotFound} from "../../models"
import {RetreatModel} from "../../models/retreat"
import {closeSnackbar, enqueueSnackbar} from "../../notistack-lib/actions"
import {apiNotification} from "../../notistack-lib/utils"
import {RootState} from "../../store"
import {updateRetreatPreferences} from "../../store/actions/retreat"
import {convertGuid} from "../../utils"
import {useRetreatByGuid} from "../../utils/retreatUtils"

type RetreatPreferencesFormPageProps = RouteComponentProps<{
  retreatGuid: string
}>
function DeprecatedRetreatPreferencesFormPage(
  props: RetreatPreferencesFormPageProps
) {
  // Setup
  let dispatch = useDispatch()

  // Path params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let [retreat] = useRetreatByGuid(retreatGuid)

  let retreatPreferencesFormLoading = useSelector(
    (state: RootState) => state.api.retreatPreferencesFormLoading
  )

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
    }
  }, [retreat])

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
          retreat.id,
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
        {retreat === ResourceNotFound ? (
          <Box
            height={"100%"}
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Typography variant="h4">Retreat not found</Typography>
          </Box>
        ) : (
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
              submitButtonText={"Start planning!"}
            />
          </PageOverlay>
        )}
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(DeprecatedRetreatPreferencesFormPage)
