import {Box, Button, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import RetreatPreferences from "../components/lodging/RetreatPreferences"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {AppRoutes} from "../Stack"
import {convertGuid} from "../utils"

let useStyles = makeStyles((theme) => ({
  ctaSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

type RetreatPreferencesFilterPageProps = RouteComponentProps<{
  retreatGuid: string
}>
function RetreatPreferencesFilterPage(
  props: RetreatPreferencesFilterPageProps
) {
  // Setup
  let dispatch = useDispatch()
  let classes = useStyles(props)

  // Path params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer
        backgroundImage={
          "https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg"
        }>
        <PageBody>
          <PageOverlay
            footerBody={
              <PageOverlayFooterDefaultBody>
                <div className={classes.ctaSection}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      dispatch(
                        push(
                          AppRoutes.getPath("DestinationsListPage", {
                            retreatGuid,
                          })
                        )
                      )
                    }>
                    Next step
                  </Button>
                </div>
              </PageOverlayFooterDefaultBody>
            }>
            <Box paddingBottom={4}>
              <PageHeader
                preHeader={<AppLodgingFlowTimeline currentStep="INTAKE_2" />}
                header="Retreat Preferences"
                subheader="Help us understand your retreat preferences so we can filter for the best lodging and destination options!"
              />
            </Box>
            <RetreatPreferences retreatGuid={retreatGuid} />
          </PageOverlay>
        </PageBody>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(RetreatPreferencesFilterPage)
