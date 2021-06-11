import {push} from "connected-react-router"
import {useEffect} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AccomodationsSearchPageBody from "../../components/accomodations/AccomodationsSearchPageBody"
import PageBody from "../../components/page/PageBody"
import PageSidenav from "../../components/page/PageSidenav"
import {AppRoutes} from "../../Stack"

type AccomodationsSearchPageProps = RouteComponentProps<{id?: string}>
function AccomodationsSearchPage(props: AccomodationsSearchPageProps) {
  let dispatch = useDispatch()
  useEffect(() => {
    console.log("mounted")
  }, [])
  return (
    <PageBody fullWidth sideNav={<PageSidenav activeItem="search" />}>
      <AccomodationsSearchPageBody
        selectedAccomodation={
          props.match.params.id ? parseInt(props.match.params.id) : undefined
        }
        onSelectAccomodation={(id: number) =>
          dispatch(
            push({
              pathname: AppRoutes.getPath("AccomodationsDetailsOverlayPage", {
                id: id.toString(),
              }),
              hash: props.location.hash,
              search: props.location.search,
            })
          )
        }
        onDeselectAccomodation={() =>
          dispatch(
            push({
              pathname: AppRoutes.getPath("AccomodationsSearchPage"),
              hash: props.location.hash,
              search: props.location.search,
            })
          )
        }
      />
    </PageBody>
  )
}
export default withRouter(AccomodationsSearchPage)
