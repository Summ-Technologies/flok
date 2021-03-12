import {RouteComponentProps, withRouter} from "react-router-dom"

type AuthPageProps = RouteComponentProps<{}>

function AuthPage(props: AuthPageProps) {
  return <div>Do some auth here.</div>
}
export default withRouter(AuthPage)
