import {useState} from "react"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppProgressStepper from "../components/base/AppProgressStepper"
import LodgingPreferencesForm from "../components/forms/LodgingPreferencesForm"
import AppLodgingProposalCard from "../components/lodging/AppLodgingProposalCard"
import AppLodgingProposalHorizonatlCard from "../components/lodging/AppLodgingProposalHorizontalCard"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {AppRoutes} from "../Stack"

type LodgingPageProps = RouteComponentProps<{}>
function LodgingPage(props: LodgingPageProps) {
  let [viewProposals, setViewProposals] = useState(false)
  return (
    <PageContainer>
      <PageSidenav activeItem="lodging" />
      <PageBody
        HeaderProps={{
          header: "Lodging",
          subheader: "GameStop Summer 2021 Retreat",
          progressBar: (
            <AppProgressStepper
              steps={[
                {
                  name: "Add attendees to Slack channel",
                  progress: "IN-PROGRESS",
                },
                {
                  name: "Add Flok with Slack Connect",
                  progress: "TODO",
                },
                {
                  name: "View and manage attendees",
                  progress: "TODO",
                },
              ]}
            />
          ),
        }}>
        {viewProposals ? (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, i) => (
                <div style={{margin: 8}}>
                  <AppLodgingProposalCard
                    href={AppRoutes.getPath("LodgingProposalPage", {id: "1"})}
                    stars={4}
                    ImgProps={{
                      img: `https://picsum.photos/400/300?x=${i}`,
                      alt: "Camp Navarro",
                    }}
                    header={`Camp Navarro ${i}`}
                    subheader="$125 / person / night"
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, i) => (
                <div style={{marginBottom: 16}}>
                  <AppLodgingProposalHorizonatlCard
                    stars={4}
                    ImgProps={{
                      img: `https://picsum.photos/400/300?x=${i}`,
                      alt: "Camp Navarro",
                    }}
                    header={`Camp Navarro ${i}`}
                    subheader="$125 / person / night"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <LodgingPreferencesForm
            submitLodgingPreferencesForm={() => setViewProposals(true)}
          />
        )}
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingPage)
