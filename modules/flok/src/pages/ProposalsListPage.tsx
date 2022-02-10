import {Button, makeStyles, Paper} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppMoreInfoIcon from "../components/base/AppMoreInfoIcon"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {HotelModel} from "../models/lodging"
import {RetreatSelectedHotelProposal} from "../models/retreat"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getHotels} from "../store/actions/lodging"
import {convertGuid, formatDollars} from "../utils"
import {
  DestinationUtils,
  HotelUtils,
  useDestinations,
  useRetreat,
} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
  },
  proposalsList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  card: {
    position: "relative",
    display: "flex",
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2),
    "& > *:not(:first-child):not($tagsContainer)": {
      marginTop: theme.spacing(1),
    },
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      maxWidth: 140,
    },
  },
  imgContainer: {
    position: "relative",
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
  spacer: {
    flexGrow: 1,
  },
  viewProposalButton: {
    padding: "8px 22px",
    marginRight: theme.spacing(2),
  },
}))

type ProposalsListPageProps = RouteComponentProps<{
  retreatGuid: string
}>
function ProposalsListPage(props: ProposalsListPageProps) {
  // Setup
  let dispatch = useDispatch()
  let classes = useStyles(props)

  // Path and query params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useRetreat(retreatGuid)

  let hotelsById = useSelector((state: RootState) => state.lodging.hotels)
  let selectedHotels = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== ResourceNotFound) {
      return retreat.selected_hotels
    }
    return []
  })

  useEffect(() => {
    document.title = "Lodging Proposals"
  }, [])

  // Probably not the best way to set loading state, but will do for now
  let [loadingHotels, setLoadingHotels] = useState(false)
  useEffect(() => {
    let missingHotels = selectedHotels.filter(
      (selectedHotel) => hotelsById[selectedHotel.hotel_id] === undefined
    )
    if (missingHotels.length > 0) {
      let filter = missingHotels
        .map((selectedHotel) => `id=${selectedHotel.hotel_id}`)
        .join(" OR ")
      dispatch(getHotels(filter))
      setLoadingHotels(true)
    } else {
      setLoadingHotels(false)
    }
  }, [selectedHotels, hotelsById, dispatch, setLoadingHotels])

  let destinations = useDestinations()[0]

  let [groupedSelectedHotels, setGroupedSelectedHotels] = useState<
    {destinationId: number; selectedHotels: RetreatSelectedHotelProposal[]}[]
  >([])
  useEffect(() => {
    let byDestinationId: {[key: number]: RetreatSelectedHotelProposal[]} = {}
    let reviewableHotels =
      hotelsById && retreat && retreat !== ResourceNotFound
        ? selectedHotels
            .filter((selectedHotel) => hotelsById[selectedHotel.hotel_id])
            .filter((selectedHotel) => selectedHotel.state === "REVIEW")
        : []
    reviewableHotels.forEach((selectedHotel) => {
      let destinationId = hotelsById[selectedHotel.hotel_id].destination_id
      if (!byDestinationId[destinationId]) {
        byDestinationId[destinationId] = []
      }
      byDestinationId[destinationId].push(selectedHotel)
    })

    setGroupedSelectedHotels(
      Object.keys(byDestinationId)
        .sort()
        .map((destId) => {
          let _destId = parseInt(destId)
          return {
            destinationId: _destId,
            selectedHotels: byDestinationId[_destId],
          }
        })
    )
  }, [selectedHotels, setGroupedSelectedHotels, hotelsById, retreat])

  // Set unavailable hotels bucket
  let [unavailableSelectedHotels, setUnavailableSelectedHotels] = useState<
    RetreatSelectedHotelProposal[]
  >([])
  useEffect(() => {
    let unavailableHotels =
      hotelsById && retreat && retreat !== ResourceNotFound
        ? selectedHotels
            .filter((selectedHotel) => hotelsById[selectedHotel.hotel_id])
            .filter((selectedHotel) => selectedHotel.state === "NOT_AVAILABLE")
            .sort(
              (a, b) =>
                hotelsById[a.hotel_id].destination_id -
                hotelsById[b.hotel_id].destination_id
            )
        : []
    setUnavailableSelectedHotels(unavailableHotels)
  }, [selectedHotels, setUnavailableSelectedHotels, retreat, hotelsById])

  /* Function to get the lowest integer for comparison values in list view. */
  function getLowestCompare(vals: (number | null)[]) {
    return vals.filter((x) => x).sort()[0]
  }

  // Actions
  function onExplore(hotel: HotelModel) {
    const newTab = window.open(
      AppRoutes.getPath("ProposalPage", {
        retreatGuid: retreatGuid,
        hotelGuid: hotel.guid,
      }),
      "_blank"
    )
    newTab?.focus()
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageOverlay>
          <PageHeader
            header={`Proposals`}
            subheader="Review proposals from hotels with negotiated prices from our team."
            retreat={
              retreat && retreat !== ResourceNotFound ? retreat : undefined
            }
          />
          <div className={classes.root}>
            {groupedSelectedHotels.length + unavailableSelectedHotels.length ===
            0 ? (
              loadingHotels ? (
                <AppTypography variant="body1">Loading...</AppTypography>
              ) : (
                <AppTypography variant="body1">
                  Check back soon. We're currently working on collecting hotel
                  proposals on your behalf!
                </AppTypography>
              )
            ) : undefined}
            {/* Available hotels render */}
            {groupedSelectedHotels.map((destList) => {
              let destination = destinations[destList.destinationId]
              if (destination && destList.selectedHotels.length) {
                return (
                  <div className={classes.proposalsList}>
                    <AppTypography variant="h2">
                      {DestinationUtils.getLocationName(destination)}
                    </AppTypography>
                    {destList.selectedHotels.map((selectedHotel) => {
                      let hotel = hotelsById[selectedHotel.hotel_id]
                      let proposals = selectedHotel.hotel_proposals
                      let proposalReady = false
                      let avgRoomCost: string | null = null
                      let avgRoomTotal: string | null = null
                      if (
                        proposals &&
                        proposals.length &&
                        selectedHotel.state === "REVIEW"
                      ) {
                        proposalReady = true
                        let lowestRoomRate = getLowestCompare(
                          proposals!.map(
                            (proposal) => proposal.compare_room_rate
                          )
                        )
                        let lowestRoomTotal = getLowestCompare(
                          proposals!.map(
                            (proposal) => proposal.compare_room_total
                          )
                        )
                        if (lowestRoomRate) {
                          avgRoomCost = formatDollars(lowestRoomRate)
                        }
                        if (lowestRoomTotal) {
                          avgRoomTotal = formatDollars(lowestRoomTotal)
                        }
                      }
                      return (
                        <Paper elevation={0} className={classes.card}>
                          <div className={classes.imgContainer}>
                            <img
                              src={hotel.spotlight_img.image_url}
                              alt={`${hotel.name} spotlight`}
                            />
                          </div>
                          <div className={classes.cardBody}>
                            <div className={classes.headerContainer}>
                              <AppTypography
                                variant="body2"
                                color="textSecondary"
                                uppercase
                                noWrap>
                                {destinations[hotel.destination_id]
                                  ? DestinationUtils.getLocationName(
                                      destinations[hotel.destination_id],
                                      true,
                                      hotel
                                    )
                                  : ""}
                              </AppTypography>
                              <AppTypography variant="h4" noWrap>
                                {hotel.name}
                              </AppTypography>
                            </div>
                            {proposalReady && (
                              <div className={classes.attributesContainer}>
                                {avgRoomCost && (
                                  <div className={classes.attributeTag}>
                                    <AppTypography
                                      variant="body2"
                                      noWrap
                                      uppercase>
                                      Avg Room Cost{" "}
                                      <AppMoreInfoIcon
                                        tooltipText={
                                          "This cost does not include tax and resort fee (if applicable)."
                                        }
                                      />
                                    </AppTypography>
                                    <AppTypography
                                      variant="body1"
                                      fontWeight="bold">
                                      {avgRoomCost}
                                    </AppTypography>
                                  </div>
                                )}
                                {avgRoomTotal && (
                                  <div className={classes.attributeTag}>
                                    <AppTypography
                                      variant="body2"
                                      noWrap
                                      uppercase>
                                      Est. Room Total{" "}
                                      <AppMoreInfoIcon
                                        tooltipText={
                                          "Based on the room rate and anticipated number of attendees. This total is an estimate of rooms only and does not include resort fees (if applicable) or taxes."
                                        }
                                      />
                                    </AppTypography>
                                    <AppTypography
                                      variant="body1"
                                      fontWeight="bold">
                                      {avgRoomTotal}
                                    </AppTypography>
                                  </div>
                                )}
                                {hotel.airport_travel_time && (
                                  <div className={classes.attributeTag}>
                                    <AppTypography
                                      variant="body2"
                                      noWrap
                                      uppercase>
                                      Airport distance{" "}
                                      <AppMoreInfoIcon
                                        tooltipText={`This travel time is calculated to the nearest major airport${
                                          hotel.airport
                                            ? `(${hotel.airport})`
                                            : ""
                                        }. There may be smaller regional airports closer to ${DestinationUtils.getLocationName(
                                          destination,
                                          false,
                                          hotel
                                        )}.`}
                                      />
                                    </AppTypography>
                                    <AppTypography
                                      variant="body1"
                                      fontWeight="bold">
                                      {HotelUtils.getAirportTravelTime(
                                        hotel.airport_travel_time
                                      )}
                                    </AppTypography>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className={classes.spacer}></div>
                          <Button
                            className={classes.viewProposalButton}
                            variant="outlined"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              onExplore(hotel)
                            }}>
                            <AppTypography variant="inherit" noWrap>
                              View Proposal
                              {proposals!.length > 1 &&
                                `s (${proposals!.length})`}
                            </AppTypography>
                          </Button>
                        </Paper>
                      )
                    })}
                  </div>
                )
              } else {
                return undefined
              }
            })}
            {/* Unavailable hotels render */}
            {unavailableSelectedHotels.length ? (
              <AppTypography variant="h2">
                Unavailable Hotels{" "}
                <AppMoreInfoIcon tooltipText="We reached out to the following hotels but they cannot support your group during the requested dates." />
              </AppTypography>
            ) : undefined}
            <div className={classes.proposalsList}>
              {unavailableSelectedHotels.map((selectedHotel) => {
                let hotel = hotelsById[selectedHotel.hotel_id]
                return (
                  <Paper elevation={0} className={classes.card}>
                    <div className={classes.imgContainer}>
                      <img
                        src={hotel.spotlight_img.image_url}
                        alt={`${hotel.name} spotlight`}
                      />
                    </div>
                    <div className={classes.cardBody}>
                      <div className={classes.headerContainer}>
                        <AppTypography
                          variant="body2"
                          color="textSecondary"
                          uppercase
                          noWrap>
                          {destinations[hotel.destination_id]
                            ? DestinationUtils.getLocationName(
                                destinations[hotel.destination_id],
                                true,
                                hotel
                              )
                            : ""}
                        </AppTypography>
                        <AppTypography variant="h4" noWrap>
                          {hotel.name}
                        </AppTypography>
                      </div>
                    </div>
                    <div className={classes.spacer}></div>
                    <Button
                      className={classes.viewProposalButton}
                      variant="contained"
                      color="default"
                      disabled>
                      <AppTypography variant="inherit" noWrap>
                        No Availability
                      </AppTypography>
                    </Button>
                  </Paper>
                )
              })}
            </div>
          </div>
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(ProposalsListPage)
