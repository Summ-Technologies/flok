import {Button, Chip, Hidden, makeStyles} from "@material-ui/core"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import AppHotelLocationMap from "../components/lodging/AppHotelLocationMap"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {Constants} from "../config"
import {ResourceNotFound} from "../models"
import {HotelModel} from "../models/lodging"
import {enqueueSnackbar} from "../notistack-lib/actions"
import {RootState} from "../store"
import {
  deleteSelectedRetreatHotel,
  postSelectedRetreatHotel,
} from "../store/actions/retreat"
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
  retreatGuid: string
}>

function HotelPage(props: HotelPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  // Query params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let hotelGuid = convertGuid(props.match.params.hotelGuid)

  // Get current hotel
  let hotel = useHotel(hotelGuid)

  // Get all destination
  let destinations = Object.values(useDestinations()[0])

  // Check if current hotel selected
  let selectedHotelIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== ResourceNotFound) {
      return retreat.selected_hotels_ids
    }
    return []
  })
  function isHotelSelected(id: number) {
    return selectedHotelIds.includes(id)
  }

  function onClickCta() {
    if (hotel && hotel !== ResourceNotFound) {
      if (isHotelSelected((hotel as HotelModel).id)) {
        dispatch(deleteSelectedRetreatHotel(retreatGuid, hotel.id))
      } else {
        if (selectedHotelIds.length < Constants.maxHotelsSelected) {
          dispatch(postSelectedRetreatHotel(retreatGuid, hotel.id))
        } else {
          dispatch(
            enqueueSnackbar({
              key: "tooManyHotelsSelected",
              message: `Can't select more than ${Constants.maxHotelsSelected} hotels`,
              options: {
                autoHideDuration: 2000,
                variant: "error",
              },
            })
          )
        }
      }
    }
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {hotel === ResourceNotFound ? (
        <NotFound404Page />
      ) : hotel === undefined ? (
        <>Loading...</>
      ) : (
        <PageContainer>
          <PageOverlay
            size="small"
            footerBody={
              <PageOverlayFooterDefaultBody>
                <Button
                  variant={isHotelSelected(hotel.id) ? "contained" : "outlined"}
                  color="primary"
                  onClick={onClickCta}>
                  {isHotelSelected(hotel.id) ? "Selected" : "Select"}
                </Button>
              </PageOverlayFooterDefaultBody>
            }
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
                      )[0]
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
