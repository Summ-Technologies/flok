import {Box, Paper, Typography} from "@material-ui/core"
import {ChatBubbleOutlineRounded} from "@material-ui/icons"
import {push} from "connected-react-router"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppPageIntro from "../../components/base/AppPageIntro"
import AppTimeline from "../../components/base/AppTimeline"
import AppTypography from "../../components/base/AppTypography"
import PageBody from "../../components/page/PageBody"
import PageSidenav from "../../components/page/PageSidenav"
import AppRetreatDetailsFilter from "../../components/retreats/RetreatDetailsFilter"
import RetreatNextStepsList from "../../components/retreats/RetreatNextStepsList"
import RetreatProposalCardList from "../../components/retreats/RetreatProposalCardList"
import {AppRoutes} from "../../Stack"
import RetreatGetters from "../../store/getters/retreat"
import UserGetters from "../../store/getters/user"

type ProposalsPageProps = RouteComponentProps<{}>
function ProposalsPage(props: ProposalsPageProps) {
  let dispatch = useDispatch()
  let userRetreat = useSelector(RetreatGetters.getRetreat)
  let user = useSelector(UserGetters.getActiveUser)
  let guests = 5
  let nights = 5

  useEffect(() => {
    if (!userRetreat) {
      dispatch(push(AppRoutes.getPath("HomePage")))
    }
  }, [userRetreat, dispatch])

  return (
    <PageBody sideNav={<PageSidenav activeItem="onboarding" />}>
      <AppPageIntro
        title={`Welcome${user && user.firstName ? `, ${user.firstName}!` : ""}`}
        body={
          "The next step to bringing your team together is to choose a proposal for your team. The proposals below were curated for you based on your responses to our questions in our intake call. Feel free to contact us if you have any questions!"
        }
      />
      <AppTimeline
        items={[
          {
            body: (
              <Box>
                <Typography variant="h3">Choose proposal</Typography>
                <AppRetreatDetailsFilter
                  guests={guests}
                  nights={nights}
                  setGuests={() => undefined}
                  setNights={() => undefined}
                />
                <Paper>
                  <Box
                    width="100%"
                    display="flex"
                    padding={1}
                    borderRadius="borderRadius">
                    <Box marginRight={1}>
                      <ChatBubbleOutlineRounded fontSize="small" />
                    </Box>
                    <AppTypography variant="body1">
                      <Box component="span" fontWeight="fontWeightMedium">
                        Note from Flok:{" "}
                      </Box>
                      Based on your preferences and timeline, we think Miami
                      makes the most sense for your retreat
                    </AppTypography>
                  </Box>
                </Paper>
                <Box>
                  <RetreatProposalCardList
                    numEmployees={guests}
                    numNights={nights}
                    proposals={userRetreat ? userRetreat.proposals : []}
                  />
                </Box>
              </Box>
            ),
            state: "in-progress",
          },
          {
            body: (
              <Box>
                <RetreatNextStepsList />
              </Box>
            ),
            state: "todo",
          },
        ]}
      />
    </PageBody>
  )
}
export default withRouter(ProposalsPage)
