import {Box, TextField, Typography} from "@material-ui/core"
import querysting from "querystring"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppFormCard from "../../components/base/AppFormCard"
import AppLoadingIndicator from "../../components/base/AppLoadingIndicator"
import PageBody from "../../components/page/PageBody"
import {getUserResetToken, postUserReset} from "../../store/actions/user"
import ApiGetters from "../../store/getters/api"
import UserGetters from "../../store/getters/user"
import {apiToModel} from "../../utils/apiUtils"
import {Form, FormUtils} from "../../utils/formUtils"

type AuthResetPageProps = RouteComponentProps<{}>
function AuthResetPage(props: AuthResetPageProps) {
  let dispatch = useDispatch()
  let {loginToken}: {loginToken: string} = apiToModel(
    querysting.parse(props.location.search)
  )
  let loginTokenUserEmail = useSelector(
    UserGetters.getUserForLoginToken(loginToken)
  )
  let loginTokenUserRequest = useSelector(
    ApiGetters.getAuthResetTokenRequest(loginToken)
  )

  let [form, setForm] = useState<Form<"password">>({
    password: {
      type: "password",
      value: "",
      label: "New password",
      validator: FormUtils.passwordValidator("signup"),
    },
  })

  useEffect(() => {
    if (loginToken !== undefined && loginTokenUserEmail === undefined) {
      dispatch(getUserResetToken(loginToken))
    }
  }, [dispatch, loginToken, loginTokenUserEmail])

  function submitForm() {
    dispatch(postUserReset(loginToken, form["password"].value))
  }
  return (
    <PageBody>
      <Box height="100%" display="flex" flexDirection="column">
        <Box paddingTop={12}>
          <AppFormCard
            flat
            submitButtonText="Reset"
            hideBody={loginTokenUserEmail === undefined}
            form={form}
            setForm={setForm}
            submitForm={submitForm}
            header={
              <>
                <Box>
                  <Typography variant="h3">Set your password</Typography>
                </Box>
                {loginTokenUserEmail ? (
                  <TextField
                    value={loginTokenUserEmail}
                    label={"Email"}
                    type="email"
                    variant="standard"
                    fullWidth
                    disabled
                  />
                ) : loginTokenUserRequest && loginTokenUserRequest.error ? (
                  <Typography variant="body1" color="error">
                    {loginTokenUserRequest.errorText}
                  </Typography>
                ) : loginToken === undefined ? (
                  <Typography variant="body1" color="error">
                    Missing token query parameter
                  </Typography>
                ) : (
                  <AppLoadingIndicator />
                )}
              </>
            }
          />
        </Box>
      </Box>
    </PageBody>
  )
}
export default withRouter(AuthResetPage)
