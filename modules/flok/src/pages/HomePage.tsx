import {push} from "connected-react-router"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageSidenav from "../components/page/PageSidenav"
import {AppRoutes} from "../Stack"
import RetreatGetters from "../store/getters/retreat"

type HomePageProps = RouteComponentProps<{}>
function HomePage(props: HomePageProps) {
  let dispatch = useDispatch()
  let userRetreat = useSelector(RetreatGetters.getRetreat)

  useEffect(() => {
    if (userRetreat) {
      dispatch(push(AppRoutes.getPath("ProposalsPage")))
    }
  }, [userRetreat, dispatch])

  return <PageBody sideNav={<PageSidenav />}></PageBody>
}
export default withRouter(HomePage)
