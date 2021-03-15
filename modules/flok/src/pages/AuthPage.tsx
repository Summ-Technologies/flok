import { Box } from "@material-ui/core"
import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import AuthCard, { AuthForm } from "../components/AuthCard"
import PageBody from "../components/PageBody"
import { AppRoutes } from "../Stack"
import { FormUtils } from "../utils/formUtils"

type AuthPageProps = RouteComponentProps<{}>
function AuthPage(props: AuthPageProps) {
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
      validator: FormUtils.validatePassword,
    },
    confirmPassword: {
      type: "text",
      value: "",
      validator: (val, form) =>
        form.password.value === val ? undefined : "Passwords don't match",
    },
  })

  let [formError, setFormError] = useState<string>("")
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
          formError={formError}
          setFormError={setFormError}
        />
      </Box>
    </PageBody>
  )
}
export default withRouter(AuthPage)
