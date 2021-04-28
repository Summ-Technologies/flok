import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppPageIntro from "../../components/base/AppPageIntro"
import PageBody from "../../components/page/PageBody"
import PageSidenav from "../../components/page/PageSidenav"
import RetreatTimeline from "../../components/retreats/RetreatTimeline"
import {RetreatProposal} from "../../models/retreat"
import {AppRoutes} from "../../Stack"
import RetreatGetters from "../../store/getters/retreat"
import UserGetters from "../../store/getters/user"

type ProposalsPageProps = RouteComponentProps<{}>
function ProposalsPage(props: ProposalsPageProps) {
  let dispatch = useDispatch()
  let userRetreat = useSelector(RetreatGetters.getRetreat)
  let proposals = useSelector(RetreatGetters.getRetreatProposals)
  let [selectedProposal, setSeletectedProposal] = useState<
    RetreatProposal | undefined
  >(undefined)
  let user = useSelector(UserGetters.getActiveUser)

  useEffect(() => {
    if (!userRetreat) {
      dispatch(push(AppRoutes.getPath("HomePage")))
    }
  }, [userRetreat, dispatch])

  useEffect(() => {
    if (
      userRetreat &&
      userRetreat.selectedProposalId &&
      proposals[userRetreat.selectedProposalId]
    ) {
      setSeletectedProposal(proposals[userRetreat.selectedProposalId])
    } else {
      setSeletectedProposal(undefined)
    }
  }, [userRetreat, proposals])

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
      {userRetreat ? (
        <RetreatTimeline
          retreat={userRetreat}
          selectedProposal={selectedProposal}
        />
      ) : undefined}
    </PageBody>
  )
}
export default withRouter(ProposalsPage)
