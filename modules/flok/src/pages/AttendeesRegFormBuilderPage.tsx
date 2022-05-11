import {makeStyles, Typography} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import FormBuilder from "../components/forms/FormBuilder"
import FormProvider from "../components/forms/FormProvider"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"

let useStyles = makeStyles((theme) => ({
  body: {
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(0.5),
    },
  },
  builderForm: {
    margin: theme.spacing(1),
    "& > :not(:first-child)": {marginTop: theme.spacing(2)},
  },
  formSection: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
  },
  formQuestionTitleInput: {
    ...theme.typography.body1,
    fontWeight: theme.typography.fontWeightBold,
  },
  formQuestionDescriptionInput: {
    ...theme.typography.body2,
  },
}))

type AttendeesRegFormBuilderProps = RouteComponentProps<{retreatIdx: string}>
function AttendeesRegFormBuilderPage(props: AttendeesRegFormBuilderProps) {
  let classes = useStyles()
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let formId = 1

  return (
    <PageContainer>
      <PageSidenav activeItem="attendees" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <div className={classes.body}>
          <Typography variant="h1">Attendee Registration Form</Typography>
          <FormProvider formId={formId}>
            <FormBuilder />
          </FormProvider>
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(AttendeesRegFormBuilderPage)
