import {RouteComponentProps, withRouter} from "react-router-dom"
import LodgingPreferencesForm from "../components/forms/LodgingPreferencesForm"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"

type LodgingFormPageProps = RouteComponentProps<{}>
function LodgingFormPage(props: LodgingFormPageProps) {
  return (
    <PageContainer>
      <PageBody
        HeaderProps={{
          header: "Lodging Form",
        }}>
        <LodgingPreferencesForm
          submitLodgingPreferencesForm={() => undefined}
        />
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingFormPage)
