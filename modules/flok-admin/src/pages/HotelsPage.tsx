import {Button, makeStyles, Typography} from "@material-ui/core"
import {push} from "connected-react-router"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import HotelSearchModal from "../components/lodging/HotelSearchModal"
import PageBase from "../components/page/PageBase"
import {AppRoutes} from "../Stack"

let useStyles = makeStyles((theme) => ({
  body: {
    flex: "1 1 auto",
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  tabs: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  table: {
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

type LodgingContentPageProps = RouteComponentProps<{}>

function HotelsPage(props: LodgingContentPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let [hotelSearchOpen, setHotelSearchOpen] = useState(false)

  return (
    <PageBase>
      <div className={classes.body}>
        <Typography variant="h1" paragraph>
          Lodging Content
        </Typography>
        <Typography variant="body1" component="div">
          Select a hotel in order to:
          <ul>
            <li>
              edit hotel data such as airport distance, name, destination, etc.
            </li>
            <li>add/remove hotel images</li>
            <li>add/edit default proposals (aka proposals database)</li>
          </ul>
        </Typography>
        <div>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => setHotelSearchOpen(true)}>
            Select hotel
          </Button>
        </div>
        {hotelSearchOpen && (
          <HotelSearchModal
            submitText="Select"
            onSubmit={(hotelId) =>
              dispatch(
                push(
                  AppRoutes.getPath("HotelPage", {hotelId: hotelId.toString()})
                )
              )
            }
            onClose={() => setHotelSearchOpen(false)}
          />
        )}
      </div>
    </PageBase>
  )
}

export default withRouter(HotelsPage)
