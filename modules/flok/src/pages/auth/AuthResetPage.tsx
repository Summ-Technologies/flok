import {Box, Typography} from "@material-ui/core"
import querysting from "querystring"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AuthResetForm from "../../components/forms/AuthResetForm"
import PageBody from "../../components/page/PageBody"
import {getUserResetToken, postUserReset} from "../../store/actions/user"
import UserGetters from "../../store/getters/user"
import {apiToModel} from "../../utils/apiUtils"
export type AuthResetPageProps = RouteComponentProps<{}>
function AuthResetPage(props: AuthResetPageProps) {
  let dispatch = useDispatch()
  let {loginToken}: {loginToken: string} = apiToModel(
    querysting.parse(props.location.search)
  )
  let loginTokenUserEmail = useSelector(
    UserGetters.getUserForLoginToken(loginToken)
  )

  useEffect(() => {
    if (loginToken !== undefined && loginTokenUserEmail === undefined) {
      dispatch(getUserResetToken(loginToken))
    }
  }, [dispatch, loginToken, loginTokenUserEmail])

  function submitForm() {
    dispatch(postUserReset(loginToken, ""))
  }
  return (
    <PageBody>
      <Box
        height="100%"
        width="100%"
        display="flex"
        justifyItems="center"
        flexDirection="column"
        maxWidth={600}
        marginLeft="auto"
        marginRight="auto"
        paddingTop={12}>
        <Box>
          <Typography variant="h3">Set your password</Typography>
        </Box>
        <AuthResetForm
          submitAuthReset={submitForm}
          prefilledEmail={loginTokenUserEmail}
        />
      </Box>
    </PageBody>
  )
}
export default withRouter(AuthResetPage)
