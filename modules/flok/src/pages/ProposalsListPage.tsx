import {makeStyles, Typography} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppMoreInfoIcon from "../components/base/AppMoreInfoIcon"
import AppTypography from "../components/base/AppTypography"
import ProposalListRow from "../components/lodging/ProposalListRow"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {HotelModel} from "../models/lodging"
import {RetreatSelectedHotelProposal} from "../models/retreat"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getHotels} from "../store/actions/lodging"
import {DestinationUtils, useDestinations} from "../utils/lodgingUtils"
import {useRetreat} from "./misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
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
  retreatIdx: string
}>
function ProposalsListPage(props: ProposalsListPageProps) {
  // Setup
  let dispatch = useDispatch()
  let classes = useStyles(props)

  // Path and query params
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()

  let hotelsById = useSelector((state: RootState) => state.lodging.hotels)
  let selectedHotels = retreat.selected_hotels

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
    let reviewableHotels = hotelsById
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
    let unavailableHotels = hotelsById
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
        retreatIdx: retreatIdx.toString(),
        hotelGuid: hotel.guid,
      }),
      "_blank"
    )
    newTab?.focus()
  }

  return (
    <PageContainer>
      <PageSidenav
        activeItem="lodging"
        retreatIdx={retreatIdx}
        companyName={retreat.company_name}
      />
      <PageBody appBar>
        <div className={classes.root}>
          <Typography variant="h1">Proposals</Typography>
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
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(ProposalsListPage)
