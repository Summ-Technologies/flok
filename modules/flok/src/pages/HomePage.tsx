import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageSidenav from "../components/page/PageSidenav"

type HomePageProps = RouteComponentProps<{}>
function HomePage(props: HomePageProps) {
  return <PageBody sideNav={<PageSidenav />}></PageBody>
}
export default withRouter(HomePage)
