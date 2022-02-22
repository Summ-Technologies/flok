import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  makeStyles,
  Modal,
  Paper,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core"
import {useFormik} from "formik"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {AdminRetreatModel, AdminSelectedHotelProposalModel} from "../../models"
import {RootState} from "../../store"
import {
  createProposalForm,
  deleteHotelProposal,
  deleteSelectedHotel,
  getDestinations,
  getHotelsByHotelId,
  postHotelProposal,
  postSelectedHotel,
  putHotelProposal,
  putSelectedHotel,
} from "../../store/actions/admin"
import AppTypography from "../base/AppTypography"
import ConfirmationModal from "../base/ConfirmationModal"
import HotelSearchModal from "../lodging/HotelSearchModal"
import HotelProposalForm from "./HotelProposalForm"

let useAccordionItemStyles = makeStyles((theme) => ({
  accordionDetails: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
}))

function HotelAccordionItem(props: {
  selectedHotel: AdminSelectedHotelProposalModel
  hotel: {name: string; location: string}
}) {
  let classes = useAccordionItemStyles()
  let dispatch = useDispatch()
  let [activeProposalIndex, setActiveProposalIndex] = useState(0)

  let [newProposalModalOpen, setNewProposalModalOpen] = useState(false)
  let [newProposalDates, setNewProposalDates] = useState<string | undefined>(
    undefined
  )
  let [removeSelectedHotelModalOpen, setRemoveSelectedHotelModalOpen] =
    useState(false)
  let [deleteProposalModalOpen, setDeleteProposalModalOpen] = useState(false)
  let proposalStateFormik = useFormik({
    enableReinitialize: true,
    initialValues: {state: props.selectedHotel.state},
    onSubmit: (values) => {
      dispatch(
        putSelectedHotel(
          props.selectedHotel.retreat_id,
          props.selectedHotel.hotel_id,
          values.state
        )
      )
    },
  })
  return (
    <Accordion>
      <AccordionSummary>
        <Box display="flex" justifyContent="space-between" width="100%">
          <AppTypography variant="body1">
            <strong>{props.hotel.name}</strong>
            {props.hotel.location ? `, ${props.hotel.location}` : ""}
          </AppTypography>
          {props.selectedHotel.state === "REVIEW" ? (
            <Chip
              label="Ready for review"
              style={{color: "white", backgroundColor: "green"}}
            />
          ) : props.selectedHotel.state === "NOT_AVAILABLE" ? (
            <Chip
              label="Not available"
              style={{color: "white", backgroundColor: "red"}}
            />
          ) : (
            <Chip label="Pending" style={{backgroundColor: "yellow"}} />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <Box display="flex" alignItems="center">
          <AppTypography variant="h3" fontWeight="bold">
            {props.hotel.name}
          </AppTypography>
          <Button
            onClick={() => setRemoveSelectedHotelModalOpen(true)}
            style={{marginLeft: 8}}
            color="secondary"
            variant="outlined"
            size="small">
            Remove Hotel
          </Button>
          {removeSelectedHotelModalOpen ? (
            <ConfirmationModal
              onSubmit={() => {
                dispatch(
                  deleteSelectedHotel(
                    props.selectedHotel.retreat_id,
                    props.selectedHotel.hotel_id
                  )
                )
              }}
              onClose={() => setRemoveSelectedHotelModalOpen(false)}
              confirmationText={`Are you sure you want to remove ${props.hotel.name}?`}
            />
          ) : undefined}
        </Box>
        <form onSubmit={proposalStateFormik.handleSubmit}>
          <Box display="flex" alignItems="center" marginY={2}>
            <TextField
              id="state"
              value={proposalStateFormik.values.state}
              onChange={proposalStateFormik.handleChange}
              select
              SelectProps={{native: true}}
              InputLabelProps={{shrink: true, style: {whiteSpace: "nowrap"}}}
              label="Current Proposal State">
              {props.selectedHotel.state === "SELECTED" && (
                <option value={"SELECTED"}>Initial</option>
              )}
              <option value={"PENDING"}>Pending</option>
              <option value={"REVIEW"}>Ready</option>
              <option value={"NOT_AVAILABLE"}>No availability</option>
            </TextField>
            {proposalStateFormik.values.state !==
              proposalStateFormik.initialValues.state && (
              <Button
                style={{marginLeft: 8}}
                type="submit"
                size="small"
                variant="contained"
                color="primary">
                Save State
              </Button>
            )}
          </Box>
        </form>
        <Box display="flex" alignItems="center">
          <AppTypography variant="h3" fontWeight="bold">
            Proposals (
            {props.selectedHotel.hotel_proposals
              ? props.selectedHotel.hotel_proposals.length
              : 0}
            )
          </AppTypography>
          <Button
            style={{marginLeft: 8}}
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => setNewProposalModalOpen(true)}>
            New Proposal
          </Button>
          <Modal
            open={newProposalModalOpen}
            onClose={() => {
              setNewProposalModalOpen(false)
              setNewProposalDates(undefined)
            }}>
            <Box
              maxWidth={400}
              minWidth={300}
              position="fixed"
              top="50%"
              left="50%"
              style={{
                transform: "translate(-50%, -50%)",
              }}>
              <Paper>
                <Box
                  paddingY={4}
                  paddingX={2}
                  display="flex"
                  flexDirection="column">
                  <AppTypography variant="body1" fontWeight="bold" paragraph>
                    New Proposal
                  </AppTypography>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setNewProposalModalOpen(false)
                      setNewProposalDates(undefined)
                    }}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Dates"
                      required
                      InputLabelProps={{shrink: true}}
                      value={newProposalDates ?? ""}
                      onChange={(e) =>
                        setNewProposalDates(e.currentTarget.value)
                      }
                    />
                    <br />
                    <br />
                    <Box display="flex" justifyContent={"space-between"}>
                      <Button
                        type="submit"
                        variant="contained"
                        onClick={() => {
                          dispatch(
                            postHotelProposal(
                              props.selectedHotel.retreat_id,
                              props.selectedHotel.hotel_id,
                              createProposalForm({
                                dates: newProposalDates,
                              })
                            )
                          )
                        }}>
                        Add
                      </Button>
                      {props.selectedHotel.hotel_proposals?.length ? (
                        <Button
                          type="submit"
                          variant="outlined"
                          onClick={() => {
                            dispatch(
                              postHotelProposal(
                                props.selectedHotel.retreat_id,
                                props.selectedHotel.hotel_id,
                                createProposalForm({
                                  ...props.selectedHotel.hotel_proposals![
                                    activeProposalIndex
                                  ]!,
                                  dates: newProposalDates,
                                })
                              )
                            )
                          }}>
                          Copy current
                        </Button>
                      ) : undefined}
                    </Box>
                  </form>
                </Box>
              </Paper>
            </Box>
          </Modal>
        </Box>
        {props.selectedHotel.hotel_proposals?.length ? (
          <>
            <Tabs
              value={activeProposalIndex}
              onChange={(e, val) => {
                setActiveProposalIndex(val)
              }}>
              {props.selectedHotel.hotel_proposals!.map((proposal, i) => (
                <Tab
                  key={i}
                  value={i}
                  label={proposal.dates ? proposal.dates : `Proposal ${i}`}
                />
              ))}
            </Tabs>
            {props.selectedHotel.hotel_proposals![activeProposalIndex] ? (
              <>
                <HotelProposalForm
                  onSave={(values) => {
                    dispatch(
                      putHotelProposal(
                        props.selectedHotel.retreat_id,
                        props.selectedHotel.hotel_id,
                        props.selectedHotel.hotel_proposals![
                          activeProposalIndex
                        ].id,
                        createProposalForm(values)
                      )
                    )
                  }}
                  onDelete={() => setDeleteProposalModalOpen(true)}
                  proposal={
                    props.selectedHotel.hotel_proposals![activeProposalIndex]
                  }
                />
                {deleteProposalModalOpen ? (
                  <ConfirmationModal
                    confirmationText="Are you sure you want to delete this proposal?"
                    onClose={() => setDeleteProposalModalOpen(false)}
                    onSubmit={() => {
                      dispatch(
                        deleteHotelProposal(
                          props.selectedHotel.retreat_id,
                          props.selectedHotel.hotel_id,
                          props.selectedHotel.hotel_proposals![
                            activeProposalIndex
                          ].id
                        )
                      )
                      setActiveProposalIndex(-1)
                    }}
                  />
                ) : undefined}
              </>
            ) : undefined}
          </>
        ) : undefined}
      </AccordionDetails>
    </Accordion>
  )
}

let useStyles = makeStyles((theme) => ({
  root: {height: "100%"},
  hotelsList: {},
}))

type RetreatLodgingDetailsProps = {retreat: AdminRetreatModel}
export default function RetreatLodgingDetails(
  props: RetreatLodgingDetailsProps
) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let [newHotelOpen, setNewHotelOpen] = useState(false)
  let hotels = useSelector((state: RootState) => state.admin.hotels)
  let destinations = useSelector((state: RootState) => state.admin.destinations)
  let destinationsList = useSelector(
    (state: RootState) => state.admin.allDestinations
  )

  useEffect(() => {
    let missingHotels: number[] = []
    props.retreat.selected_hotels.forEach((selectedHotel) => {
      if (hotels[selectedHotel.hotel_id] == null) {
        missingHotels.push(selectedHotel.hotel_id)
      }
    })
    if (missingHotels.length) {
      dispatch(getHotelsByHotelId(missingHotels))
    }
  }, [hotels, props.retreat.selected_hotels, dispatch])

  useEffect(() => {
    let missingHotels: number[] = []
    props.retreat.selected_hotels.forEach((selectedHotel) => {
      if (hotels[selectedHotel.hotel_id] == null) {
        missingHotels.push(selectedHotel.hotel_id)
      }
    })
    if (missingHotels.length) {
      dispatch(getHotelsByHotelId(missingHotels))
    }
  }, [hotels, props.retreat.selected_hotels, dispatch])

  useEffect(() => {
    if (destinationsList == null) {
      dispatch(getDestinations())
    }
  }, [destinationsList, dispatch])

  return (
    <div className={classes.root}>
      <Box display="flex" justifyContent="space-between" marginY={2}>
        <AppTypography variant="h4">Hotel Options</AppTypography>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => setNewHotelOpen(true)}>
          Add Hotel
        </Button>
        {newHotelOpen && (
          <HotelSearchModal
            onSubmit={(hotelId) =>
              dispatch(postSelectedHotel(props.retreat.id, hotelId))
            }
            onClose={() => setNewHotelOpen(false)}
          />
        )}
      </Box>
      <div className={classes.hotelsList}>
        {!props.retreat.selected_hotels.length ? (
          <AppTypography variant="body1">
            No hotel proposals created yet. Add a hotel to start.
          </AppTypography>
        ) : undefined}
        {props.retreat.selected_hotels
          .sort((a, b) => {
            let hotelA = hotels[a.hotel_id]
            let hotelB = hotels[b.hotel_id]
            if (hotelA && hotelB) {
              return hotelA.destination_id - hotelB.destination_id
            }
            return 0
          })
          .map((selectedHotel) => (
            <HotelAccordionItem
              hotel={{
                name: hotels[selectedHotel.hotel_id]?.name
                  ? hotels[selectedHotel.hotel_id]!.name
                  : "",
                location:
                  hotels[selectedHotel.hotel_id]?.destination_id &&
                  destinations[
                    hotels[selectedHotel.hotel_id]!.destination_id
                  ] &&
                  destinations[hotels[selectedHotel.hotel_id]!.destination_id]
                    ?.location
                    ? destinations[
                        hotels[selectedHotel.hotel_id]!.destination_id
                      ]?.location!
                    : "",
              }}
              selectedHotel={selectedHotel}
              key={selectedHotel.hotel_id}
            />
          ))}
      </div>
    </div>
  )
}
