import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
} from "@material-ui/core"
import React from "react"
import {
  AdminRetreatDetailsModel,
  AdminSelectedHotelProposal,
} from "../../models"
import AppTypography from "../base/AppTypography"
import HotelProposalForm from "./HotelProposalForm"

let useStyles = makeStyles((theme) => ({
  root: {height: "100%"},
  hotelsList: {},
}))

function HotelAccordionItem(props: {
  selectedHotel: AdminSelectedHotelProposal
  hotel: {name: string; location: string}
}) {
  return (
    <Accordion>
      <AccordionSummary>
        <AppTypography variant="body1" fontWeight="bold">
          {props.hotel.name}
        </AppTypography>
        <AppTypography variant="body1" fontWeight="bold">
          {props.hotel.location}
        </AppTypography>
      </AccordionSummary>
      <AccordionDetails>
        <HotelProposalForm
          proposal={
            props.selectedHotel.hotel_proposals?.length
              ? props.selectedHotel.hotel_proposals[0]
              : {id: -1, additional_links: []}
          }
        />
      </AccordionDetails>
    </Accordion>
  )
}

type RetreatLodgingDetailsProps = {retreat: AdminRetreatDetailsModel}
export default function RetreatLodgingDetails(
  props: RetreatLodgingDetailsProps
) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <AppTypography variant="h4">Hotel Options</AppTypography>
      <div className={classes.hotelsList}></div>
    </div>
  )
}
