import {useState} from "react"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppHeader from "../components/base/AppHeader"
import AppProgressStepper from "../components/base/AppProgressStepper"
import LodgingPreferencesForm from "../components/forms/LodgingPreferencesForm"
import AppLodgingProposalCard from "../components/lodging/AppLodgingProposalCard"
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
                  name: "Lodging Questions",
                  progress: "IN-PROGRESS",
                },
                {
                  name: "View Proposals",
                  progress: "TODO",
                },
                {
                  name: "Book Lodging",
                  progress: "TODO",
                },
              ]}
            />
          ),
        }}>
        {viewProposals ? (
          <>
            <AppHeader
              header={"Review lodging proposals"}
              subheader={"Destination: Berlin Germany"}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, i) => (
                <div
                  style={{
                    padding: 8,
                  }}>
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
