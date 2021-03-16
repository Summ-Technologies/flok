import {Box} from "@material-ui/core"
import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AuthCard, {AuthForm} from "../components/AuthCard"
import PageBody from "../components/PageBody"
import {AppRoutes} from "../Stack"
import {postUserSignin, postUserSignup} from "../store/actions/user"
import ApiGetters from "../store/getters/api"
import {FormUtils} from "../utils/formUtils"

type AuthPageProps = RouteComponentProps<{}>
function AuthPage(props: AuthPageProps) {
  let dispatch = useDispatch()

  let signupRequest = useSelector(ApiGetters.getSignupRequest)
  let signinRequest = useSelector(ApiGetters.getSigninRequest)

  const authType =
    props.location.pathname.toLowerCase() ===
    AppRoutes.getPath("SignupPage").toLowerCase()
      ? "signup"
      : "signin"

  let [form, setForm] = useState<AuthForm>({
    email: {
      type: "text",
      value: "",
      validator: FormUtils.validateEmail,
    },
    password: {
      type: "text",
      value: "",
      validator: FormUtils.passwordValidator(authType),
    },
    confirmPassword: {
      type: "text",
      value: "",
      validator: (val, form) =>
        form.password.value === val ? undefined : "Passwords don't match",
    },
  })

  function submitAuthForm() {
    switch (authType) {
      case "signin":
        dispatch(postUserSignin(form.email.value, form.password.value))
        break
      case "signup":
        dispatch(postUserSignup(form.email.value, form.password.value))
        break
    }
  }
  return (
    <PageBody>
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        <AuthCard
          authType={authType}
          form={form}
          setForm={setForm}
          request={authType === "signup" ? signupRequest : signinRequest}
          submitAuthForm={submitAuthForm}
        />
      </Box>
    </PageBody>
  )
}
export default withRouter(AuthPage)
