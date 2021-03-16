import {Box} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/PageBody"

type HomePageProps = RouteComponentProps<{}>
function HomePage(props: HomePageProps) {
  return (
    <PageBody>
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        Home sweet home
      </Box>
    </PageBody>
  )
}
export default withRouter(HomePage)
