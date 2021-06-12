import {Box} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import SigninForm from "../../components/forms/SigninForm"
import PageBody from "../../components/page/PageBody"

type SigninPageProps = RouteComponentProps<{}>
function SigninPage(props: SigninPageProps) {
  return (
    <PageBody fullWidth>
      <Box
        style={{width: "100%", height: "100%"}}
        display="flex"
        justifyContent="center">
        <Box maxWidth={500} width={"90%"} paddingTop={12}>
          <SigninForm submitSigninForm={() => {}} />
        </Box>
      </Box>
    </PageBody>
  )
}
export default withRouter(SigninPage)
