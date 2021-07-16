import {Box} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import SigninForm from "../../components/forms/SigninForm"
import PageContainer from "../../components/page/PageContainer"

type SigninPageProps = RouteComponentProps<{}>
function SigninPage(props: SigninPageProps) {
  return (
    <PageContainer>
      <Box
        style={{width: "100%", height: "100%"}}
        display="flex"
        justifyContent="center">
        <Box maxWidth={500} width={"90%"} paddingTop={12}>
          <SigninForm submitSigninForm={() => {}} />
        </Box>
      </Box>
    </PageContainer>
  )
}
export default withRouter(SigninPage)
