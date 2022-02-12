import {makeStyles} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppMoreInfoIcon from "../components/base/AppMoreInfoIcon"
import AppTypography from "../components/base/AppTypography"
import ProposalListRow from "../components/lodging/ProposalListRow"
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
import {convertGuid} from "../utils"
import {
  DestinationUtils,
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
                      let proposals = selectedHotel.hotel_proposals || []
                      return (
                        <ProposalListRow
                          hotel={hotel}
                          destination={destination}
                          proposals={proposals}
                          onViewProposal={() => onExplore(hotel)}
                        />
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
                let destination = destinations[hotel.destination_id]
                return destination ? (
                  <ProposalListRow
                    unavailable
                    hotel={hotel}
                    proposals={[]}
                    destination={destination}
                  />
                ) : undefined
              })}
            </div>
          </div>
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(ProposalsListPage)
