import {Chip, Hidden, makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import AppHotelLocationMap from "../components/lodging/AppHotelLocationMap"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {convertGuid} from "../utils"
import {
  DestinationUtils,
  HotelUtils,
  useDestinations,
  useHotel,
} from "../utils/lodgingUtils"
import NotFound404Page from "./misc/NotFound404Page"

let useStyles = makeStyles((theme) => ({
  mapContainer: {
    maxHeight: 430,
    minHeight: 400,
    height: "100%",
    marginTop: "auto",

    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  attributesContainer: {
    display: "flex",
    flexDirection: "row",
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
}))

type HotelPageProps = RouteComponentProps<{
  hotelGuid: string
  retreatIdx: string
}>

function HotelPage(props: HotelPageProps) {
  let classes = useStyles(props)

  // Query params
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let hotelGuid = convertGuid(props.match.params.hotelGuid)

  // Get current hotel
  let hotel = useHotel(hotelGuid)

  // Get all destination
  let destinations = Object.values(useDestinations()[0])

  return (
    <RetreatRequired retreatIdx={retreatIdx}>
      {hotel === ResourceNotFound ? (
        <NotFound404Page />
      ) : hotel === undefined ? (
        <>Loading...</>
      ) : (
        <PageContainer>
          <PageOverlay
            size="small"
            right={<AppImageGrid images={hotel.imgs} />}>
            <PageHeader
              header={hotel.name}
              subheader={
                destinations.filter(
                  (dest) =>
                    dest.id ===
                    (hotel !== undefined && hotel !== ResourceNotFound
                      ? hotel.destination_id
                      : -1000)
                )[0]
                  ? DestinationUtils.getLocationName(
                      destinations.filter(
                        (dest) =>
                          dest.id ===
                          (hotel !== undefined && hotel !== ResourceNotFound
                            ? hotel.destination_id
                            : -1000)
                      )[0],
                      false,
                      hotel
                    )
                  : ""
              }
            />
            <AppTypography variant="body1" paragraph>
              {hotel.description}
            </AppTypography>
            <div className={classes.attributesContainer}>
              <div className={classes.attributeTag}>
                <AppTypography variant="body2" noWrap uppercase>
                  Price
                </AppTypography>
                <AppTypography variant="body1" fontWeight="bold">
                  {hotel.price}
                </AppTypography>
              </div>
              {hotel.airport_travel_time ? (
                <div className={classes.attributeTag}>
                  <AppTypography variant="body2" noWrap uppercase>
                    Airport Distance
                  </AppTypography>
                  <AppTypography variant="body1" fontWeight="bold">
                    {HotelUtils.getAirportTravelTime(hotel.airport_travel_time)}
                  </AppTypography>
                </div>
              ) : undefined}
              <div className={classes.attributeTag}>
                <AppTypography variant="body2" noWrap uppercase>
                  Rooms
                </AppTypography>
                <AppTypography variant="body1" fontWeight="bold">
                  {hotel.num_rooms}
                </AppTypography>
              </div>
            </div>
            <div className={classes.tagsContainer}>
              {hotel.lodging_tags.map(({name}) => (
                <Chip size="small" label={name} />
              ))}
            </div>
            {hotel.address_coordinates ? (
              <div className={classes.mapContainer}>
                <AppHotelLocationMap
                  lat={hotel.address_coordinates[0]}
                  long={hotel.address_coordinates[1]}
                />
              </div>
            ) : undefined}
            <Hidden mdUp>
              <AppImageGrid images={hotel.imgs} />
            </Hidden>
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}
export default withRouter(HotelPage)
