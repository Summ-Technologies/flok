import {Box} from "@material-ui/core"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppPageIntro from "../../components/base/AppPageIntro"
import GoogleMap from "../../components/google/GoogleMap"
import PageBody from "../../components/page/PageBody"
import PageSidenav from "../../components/page/PageSidenav"
import UserGetters from "../../store/getters/user"

type AccomodationsPageProps = RouteComponentProps<{}>
function AccomodationsPage(props: AccomodationsPageProps) {
  let dispatch = useDispatch()
  let user = useSelector(UserGetters.getActiveUser)

  return (
    <PageBody fullWidth sideNav={<PageSidenav activeItem="accomodations" />}>
      <Box display="flex" flexDirection="column" height="100%">
        <AppPageIntro
          title={`Welcome${
            user && user.firstName ? `, ${user.firstName}!` : ""
          }`}
          body={"Time to select your accomodations"}
        />
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center">
          <Box flex={1} height="100%" width="100%">
            <GoogleMap markers={[{lat: 1, long: 1, text: "Test"}]} />
          </Box>
          <Box flex={1}></Box>
        </Box>
      </Box>
    </PageBody>
  )
}
export default withRouter(AccomodationsPage)
