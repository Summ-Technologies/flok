import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  makeStyles,
  Modal,
  Paper,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core"
import {useFormik} from "formik"
import React, {useState} from "react"
import {AdminRetreatModel, AdminSelectedHotelProposalModel} from "../../models"
import AppTypography from "../base/AppTypography"
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
  let [activeProposalIndex, setActiveProposalIndex] = useState(0)
  let [newProposalModalOpen, setNewProposalModalOpen] = useState(false)
  let proposalStateFormik = useFormik({
    initialValues: {state: props.selectedHotel.state},
    onSubmit: (values) => console.log(values),
  })
  return (
    <Accordion>
      <AccordionSummary>
        <AppTypography variant="body1" fontWeight="bold">
          {props.hotel.name}
        </AppTypography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <Box display="flex" alignItems="center">
          <AppTypography variant="h3" fontWeight="bold">
            {props.hotel.name}, {props.hotel.location}
          </AppTypography>
          <Button
            style={{marginLeft: 8}}
            color="secondary"
            variant="outlined"
            size="small">
            Remove Hotel
          </Button>
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
            onClose={() => setNewProposalModalOpen(false)}>
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
                  <form>
                    <TextField
                      fullWidth
                      type="text"
                      label="Dates"
                      required
                      InputLabelProps={{shrink: true}}
                    />
                    <br />
                    <br />
                    <Box display="flex" justifyContent={"space-between"}>
                      <Button type="submit" variant="contained">
                        Add
                      </Button>
                      {props.selectedHotel.hotel_proposals?.length ? (
                        <Button type="submit" variant="outlined">
                          Copy previous
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
              onChange={(e, val) => setActiveProposalIndex(val)}>
              {props.selectedHotel.hotel_proposals!.map((proposal, i) => (
                <Tab
                  key={i}
                  value={i}
                  label={proposal.dates ? proposal.dates : `Proposal ${i}`}
                />
              ))}
            </Tabs>
            <HotelProposalForm
              proposal={
                props.selectedHotel.hotel_proposals
                  ? props.selectedHotel.hotel_proposals[activeProposalIndex]
                  : {}
              }
            />
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
  return (
    <div className={classes.root}>
      <Box display="flex" justifyContent="space-between" marginY={2}>
        <AppTypography variant="h4">Hotel Options</AppTypography>
        <Button color="primary" variant="outlined">
          Add Hotel
        </Button>
      </Box>
      <div className={classes.hotelsList}>
        {props.retreat.selected_hotels.map((selectedHotel) => (
          <HotelAccordionItem
            hotel={{
              name: selectedHotel.hotel_id.toString(),
              location: selectedHotel.hotel_id.toString(),
            }}
            selectedHotel={selectedHotel}
            key={selectedHotel.hotel_id}
          />
        ))}
      </div>
    </div>
  )
}
