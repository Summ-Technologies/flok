import {makeStyles, Paper} from "@material-ui/core"
import {useEffect} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLogo from "../components/base/AppLogo"
import AppTypography from "../components/base/AppTypography"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import {postRFPLiteResponse} from "../store/actions/lodging"
import {useQuery} from "../utils"

let useStyles = makeStyles((theme) => ({
  body: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    "& > *:not(:last-child)": {
      paddingBottom: theme.spacing(1),
    },
  },
}))

type RFPLiteResponsePageProps = RouteComponentProps<{}>
function RFPLiteResponsePage(props: RFPLiteResponsePageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let availability = useQuery("avail")
  let hotel = useQuery("hotel")
  let dates = useQuery("dates")
  let lodgingProposalRequestId = useQuery("reqId")

  useEffect(() => {
    function postResponse() {
      if (
        lodgingProposalRequestId &&
        !isNaN(parseInt(lodgingProposalRequestId)) &&
        availability &&
        ["true", "false"].includes(availability.toLowerCase()) &&
        hotel !== null
      ) {
        dispatch(
          postRFPLiteResponse(
            parseInt(lodgingProposalRequestId),
            availability.toLowerCase() === "true",
            hotel,
            dates !== null ? dates : undefined
          )
        )
      }
    }
    postResponse()
  }, [dates, hotel, availability, lodgingProposalRequestId, dispatch])

  return (
    <PageContainer
      backgroundImage={
        "https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg"
      }>
      <PageBody>
        <div className={classes.body}>
          <Paper className={classes.modal} elevation={2}>
            <AppLogo height={50} withText noBackground />
            <AppTypography variant="h2">
              Thank you for your response!
            </AppTypography>
          </Paper>
        </div>
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(RFPLiteResponsePage)
