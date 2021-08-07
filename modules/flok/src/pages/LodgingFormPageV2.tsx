import {Grid, makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import LodgingPreferencesForm from "../components/lodging/LodgingPreferencesForm"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"

const useStyles = makeStyles((theme) => ({
  formContainer: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    height: "100%",
  },
}))

type LodgingFormPageProps = RouteComponentProps<{}>
function LodgingFormPage(props: LodgingFormPageProps) {
  const classes = useStyles()
  return (
    <PageContainer>
      <PageBody
        noGutter
        backgroundImage={
          "https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg"
        }>
        <Grid container className={classes.formContainer}>
          <Grid item xs={11} sm={9} md={7}>
            <LodgingPreferencesForm />
          </Grid>
        </Grid>
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingFormPage)
