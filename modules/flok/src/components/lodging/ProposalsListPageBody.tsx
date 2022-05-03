import {Box, Dialog, makeStyles, Typography} from "@material-ui/core"
import {KingBedOutlined} from "@material-ui/icons"
import React, {useEffect, useRef, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {HotelModel} from "../../models/lodging"
import {RetreatModel, RetreatSelectedHotelProposal} from "../../models/retreat"
import {AppRoutes} from "../../Stack"
import {RootState} from "../../store"
import {getHotels} from "../../store/actions/lodging"
import {theme} from "../../theme"
import {DestinationUtils, useDestinations} from "../../utils/lodgingUtils"
import AppMoreInfoIcon from "../base/AppMoreInfoIcon"
import AppTypography from "../base/AppTypography"
import ProposalListRow from "./ProposalListRow"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    flex: 1,
    height: "100%",
    position: "relative",
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
  noHotelsModalBody: {
    maxWidth: "40vw",
    maxHeight: "40vh",
    minWidth: 300,
    minHeight: 300,
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "baseline",
    justifyContent: "center",
    padding: 24,
    textAlign: "center",
  },
  modalHeader: {
    marginBottom: theme.spacing(1),
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

  let dialogContainerRef = useRef<HTMLDivElement>(null)
  return (
    <div className={classes.root} ref={dialogContainerRef}>
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
            <AppTypography variant="body1" fontWeight="bold">
              Loading...
            </AppTypography>
          ) : (
            <Dialog
              open={true}
              maxWidth="sm"
              hideBackdrop
              style={{position: "absolute"}}
              container={dialogContainerRef.current ?? document.body}>
              <div className={classes.noHotelsModalBody}>
                <AppTypography
                  variant="h1"
                  fontWeight="bold"
                  uppercase
                  className={classes.modalHeader}>
                  <KingBedOutlined fontSize="large" /> Check Back Soon{" "}
                  <KingBedOutlined fontSize="large" />
                </AppTypography>
                <AppTypography variant="body1">
                  We're currently working on collecting hotel proposals on your
                  behalf! We'll let you know when we've added proposals to the
                  database.
                </AppTypography>
              </div>
            </Dialog>
            // <Paper elevation={0} className={classes.noHotelsMsg}>
            // </Paper>
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
      </Box>
    </div>
  )
}
