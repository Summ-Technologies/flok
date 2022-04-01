import {makeStyles, Typography} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {useRetreat} from "./misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    flex: 1,
    overflow: "hidden",
  },
  itineraryContainer: {
    display: "flex",
    flex: 1,
    maxWidth: 680,
    overflow: "auto",
    backgroundColor: theme.palette.common.white,
  },
}))

type RetreatItineraryPageProps = RouteComponentProps<{retreatIdx: string}>
function RetreatItineraryPage(props: RetreatItineraryPageProps) {
  let classes = useStyles(props)
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()
  // let [id, setId] = useState("6yw9rqwxd98wqz2arnptxnkqw2ut2xq")

  return (
    <PageContainer>
      <PageSidenav
        activeItem="itinerary"
        retreatIdx={retreatIdx}
        companyName={retreat.company_name}
      />
      <PageBody appBar>
        <div className={classes.root}>
          <Typography variant="h1">Itinerary</Typography>
          {/* <Box display="flex" height="100%" position="relative">
            <List>
              <ListItem
                selected={id === "6yw9rqus2rtwqz2agqajrlfbler4tqq"}
                onClick={() => setId("6yw9rqus2rtwqz2agqajrlfbler4tqq")}
                button>
                Itinerary First Draft
              </ListItem>
              <ListItem
                selected={id === "6yw9rqyxzwesqz2ashmpgfwqrzrv84q"}
                onClick={() => setId("6yw9rqyxzwesqz2ashmpgfwqrzrv84q")}
                button>
                sup
              </ListItem>
              <ListItem
                selected={id === "6yw9rqwxd98wqz2arnptxnkqw2ut2xq"}
                onClick={() => setId("6yw9rqwxd98wqz2arnptxnkqw2ut2xq")}
                button>
                sup
              </ListItem>
            </List>
            <div className={classes.itineraryContainer}>
              <AppTravefyItinerary travefyItineraryId={id} />
            </div>
          </Box> */}
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatItineraryPage)
