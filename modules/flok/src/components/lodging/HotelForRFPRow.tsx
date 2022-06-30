import {Button, makeStyles, Paper} from "@material-ui/core"
import {useDispatch} from "react-redux"
import {DestinationModel, HotelModel} from "../../models/lodging"
import {useRetreat} from "../../pages/misc/RetreatProvider"
import {postSelectedHotel} from "../../store/actions/retreat"
import {DestinationUtils, HotelUtils} from "../../utils/lodgingUtils"
import AppMoreInfoIcon from "../base/AppMoreInfoIcon"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  card: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    maxWidth: "100%",
    flexDirection: "row",
    padding: theme.spacing(1),
  },
  imgContainer: {
    position: "relative",
    flexShrink: 0,
    marginRight: theme.spacing(1),
    height: 150,
    width: 220,
    [theme.breakpoints.down("xs")]: {
      height: 100,
      width: 133,
    },
    "& img": {
      borderRadius: theme.shape.borderRadius,
      objectFit: "cover",
      verticalAlign: "center",
      height: "100%",
      width: "100%",
    },
  },
  imgAndBodyContainer: {
    display: "flex",
    flexWrap: "nowrap",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: theme.spacing(1),
  },
  attributesContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    marginLeft: theme.spacing(-0.5),
    marginBottom: theme.spacing(0.5),
    "& > *": {
      marginBottom: theme.spacing(0.5),
      marginLeft: theme.spacing(0.5),
    },
  },
  attributeTag: {
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: theme.palette.grey[300], // matching chip default background color
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: theme.spacing(-0.5),
    "& > *": {
      marginLeft: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
  },
  viewProposalButton: {
    alignSelf: "center",
    // padding: "19px 22px",
    marginTop: "auto",
    marginLeft: "auto",
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))

type ProposalListRowProps = {
  hotel: HotelModel
  destination: DestinationModel
  selected?: boolean
  setModalOpen: () => void
}
function HotelForRFPRow(props: ProposalListRowProps) {
  let {hotel, destination} = {
    ...props,
  }
  let dispatch = useDispatch()
  let [retreat] = useRetreat()

  let classes = useStyles()
  return (
    <Paper elevation={0} className={classes.card}>
      <div className={classes.imgAndBodyContainer}>
        <div className={classes.imgContainer}>
          <img
            src={hotel.spotlight_img.image_url}
            alt={`${hotel.name} spotlight`}
          />
        </div>
        <div className={classes.cardBody}>
          <div className={classes.headerContainer}>
            <AppTypography variant="body2" color="textSecondary" uppercase>
              {DestinationUtils.getLocationName(destination, true, hotel)}
            </AppTypography>
            <AppTypography variant="h4">{hotel.name}</AppTypography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              overflowWrap: "initial",
            }}>
            {hotel.airport_travel_time && (
              <div className={classes.attributeTag}>
                <AppTypography variant="body2" noWrap uppercase>
                  Airport distance{" "}
                  <AppMoreInfoIcon
                    tooltipText={`This travel time is calculated to the nearest major airport${
                      hotel.airport ? `(${hotel.airport})` : ""
                    }. There may be smaller regional airports closer to ${DestinationUtils.getLocationName(
                      destination,
                      false,
                      hotel
                    )}.`}
                  />
                </AppTypography>
                <AppTypography variant="body1" fontWeight="bold">
                  {HotelUtils.getAirportTravelTime(hotel.airport_travel_time)}
                </AppTypography>
              </div>
            )}
            {hotel.num_rooms && (
              <div className={classes.attributeTag}>
                <AppTypography variant="body2" noWrap uppercase>
                  Number of Rooms
                </AppTypography>
                <AppTypography variant="body1" fontWeight="bold">
                  {hotel.num_rooms}
                </AppTypography>
              </div>
            )}
            {hotel.price && (
              <div className={classes.attributeTag}>
                <AppTypography variant="body2" noWrap uppercase>
                  Price
                </AppTypography>
                <AppTypography variant="body1" fontWeight="bold">
                  {hotel.price}
                </AppTypography>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              marginTop: "8px",
              maxWidth: "100%",
              overflow: "hidden",
            }}>
            {hotel.lodging_tags.map((tag) => {
              return (
                <div
                  className={classes.attributeTag}
                  style={{marginTop: 4, color: "white"}}>
                  <AppTypography fontWeight="bold">{tag.name}</AppTypography>
                </div>
              )
            })}
            {hotel.is_flok_recommended && (
              <div
                className={classes.attributeTag}
                style={{marginTop: 4, color: "white"}}>
                <AppTypography fontWeight="bold">
                  Flok Recommended
                </AppTypography>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{marginLeft: 24}}></div>

      <Button
        className={classes.viewProposalButton}
        variant={"outlined"}
        size="small"
        color="primary"
        disabled={props.selected}
        onClick={() => {
          if (retreat.request_for_proposal) {
            dispatch(postSelectedHotel("REQUESTED", retreat.id, hotel.id))
          } else {
            props.setModalOpen()
          }
        }}>
        <AppTypography variant="inherit" noWrap>
          {props.selected ? "Requested" : "Request Proposal"}
        </AppTypography>
      </Button>
    </Paper>
  )
}
export default HotelForRFPRow
