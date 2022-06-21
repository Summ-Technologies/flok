import {makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import FormProvider from "../components/forms/FormProvider"
import FormViewer from "../components/forms/FormViewer"
import PageBody from "../components/page/PageBody"

let useStyles = makeStyles((theme) => ({
  body: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: 1100,
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(0.5),
    },
  },
}))

type AttendeesRegFormProps = RouteComponentProps<{retreatIdx: string}>
function AttendeesRegFormPage(props: AttendeesRegFormProps) {
  let classes = useStyles()
  let formId = 1

  return (
    <PageBody>
      <div className={classes.body}>
        <FormProvider formId={formId}>
          <FormViewer />
        </FormProvider>
      </div>
    </PageBody>
  )
}

export default withRouter(AttendeesRegFormPage)
