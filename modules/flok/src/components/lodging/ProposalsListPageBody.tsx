import {Box, makeStyles, Typography} from "@material-ui/core"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RetreatModel, RetreatSelectedHotelProposal} from "../../models/retreat"
import {AppRoutes} from "../../Stack"
import {RootState} from "../../store"
import {getHotels} from "../../store/actions/lodging"
import {theme} from "../../theme"
import {DestinationUtils, useDestinations} from "../../utils/lodgingUtils"
import AppMoreInfoIcon from "../base/AppMoreInfoIcon"
import AppTypography from "../base/AppTypography"
import PageLockedModal from "../page/PageLockedModal"
import ProposalListRow from "./ProposalListRow"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    flex: 1,
    height: "100%",
  },
  header: {},
  proposalsList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    marginTop: theme.spacing(2),
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

type ProposalsListPageBodyProps = {retreat: RetreatModel; retreatIdx: number}
export default function ProposalsListPageBody(
  props: ProposalsListPageBodyProps
) {
  let {retreat, retreatIdx} = {...props}
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let hotelsById = useSelector((state: RootState) => state.lodging.hotels)
  let selectedHotels = retreat.selected_hotels

  // Probably not the best way to set loading state, but will do for now
  let [loadingHotels, setLoadingHotels] = useState(false)
  useEffect(() => {
    async function loadMissingHotels(ids: number[]) {
      setLoadingHotels(true)
      await dispatch(getHotels(ids))
      setLoadingHotels(false)
    }
    let missingHotels = selectedHotels.filter(
      (selectedHotel) => hotelsById[selectedHotel.hotel_id] === undefined
    )
    if (missingHotels.length > 0) {
      let missingHotelIds = missingHotels.map(
        (selectedHotel) => selectedHotel.hotel_id
      )
      loadMissingHotels(missingHotelIds)
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

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h1">
          Lodging
          <Typography
            variant="inherit"
            style={{fontWeight: theme.typography.fontWeightLight}}>
            {" "}
            - Hotel Proposals
          </Typography>
        </Typography>
        <Typography variant="body1">
          Review the following hotel proposals with negotiated prices from our
          team.
        </Typography>
      </div>
      <Box overflow="auto" width="100%">
        {groupedSelectedHotels.length + unavailableSelectedHotels.length ===
        0 ? (
          loadingHotels ? (
            <AppTypography variant="body1">Loading...</AppTypography>
          ) : (
            <PageLockedModal pageDesc="We're currently working on collecting hotel proposals on your behalf and will let you know they are ready to view!" />
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
                      proposalUrl={AppRoutes.getPath(
                        "RetreatLodgingProposalPage",
                        {
                          retreatIdx: retreatIdx.toString(),
                          hotelGuid: hotel.guid,
                        }
                      )}
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
        <div className={classes.proposalsList}>
          {unavailableSelectedHotels.length ? (
            <AppTypography variant="h2">
              Unavailable Hotels{" "}
              <AppMoreInfoIcon tooltipText="We reached out to the following hotels but they cannot support your group during the requested dates." />
            </AppTypography>
          ) : undefined}
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
      </Box>
    </div>
  )
}
