import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/PageBody"

type AuthPageProps = RouteComponentProps<{}>

function AuthPage(props: AuthPageProps) {
  return (
    <PageBody>
      <div>Do some auth here.</div>
    </PageBody>
  )
}
export default withRouter(AuthPage)
