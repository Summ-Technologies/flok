import {Box, Collapse, Paper, Typography} from "@material-ui/core"
import {ChatBubbleOutlineRounded} from "@material-ui/icons"
import React from "react"
import {useDispatch} from "react-redux"
import AppTimeline from "../../components/base/AppTimeline"
import AppTypography from "../../components/base/AppTypography"
import AppRetreatDetailsFilter from "../../components/retreats/RetreatDetailsFilter"
import RetreatProposalCardList from "../../components/retreats/RetreatProposalCardList"
import {RetreatModel, RetreatProposal} from "../../models/retreat"
import {getUserHome} from "../../store/actions/user"
import {AppTimelineItemState} from "../base/AppTimeline/AppTimelineItem"
import RetreatNextStepsList from "./RetreatNextStepsList"
import RetreatPaymentReview from "./RetreatPaymentReview"

type RetreatTimelineProps = {
  retreat: RetreatModel
  selectedProposal?: RetreatProposal
}
export default function RetreatTimeline(props: RetreatTimelineProps) {
  let dispatch = useDispatch()
  let {retreat, selectedProposal} = {...props}
  let guests = 5
  let nights = 5

  return (
    <AppTimeline
      items={[
        {
          state: selectedProposal ? "completed" : "in-progress",
          body: (
            <Box>
              <Typography variant="h3">
                Choose proposal
                {selectedProposal ? ` (${selectedProposal.title})` : undefined}
              </Typography>
              <Collapse in={selectedProposal ? false : true}>
                <AppRetreatDetailsFilter
                  guests={guests}
                  nights={nights}
                  setGuests={() => undefined}
                  setNights={() => undefined}
                />
                <Paper>
                  <Box
                    width="100%"
                    display="flex"
                    padding={1}
                    borderRadius="borderRadius">
                    <Box marginRight={1}>
                      <ChatBubbleOutlineRounded fontSize="small" />
                    </Box>
                    <AppTypography variant="body1">
                      <Box component="span" fontWeight="fontWeightMedium">
                        Note from Flok:{" "}
                      </Box>
                      Based on your preferences and timeline, we think Miami
                      makes the most sense for your retreat
                    </AppTypography>
                  </Box>
                </Paper>
                <Box>
                  <RetreatProposalCardList
                    numEmployees={guests}
                    numNights={nights}
                    proposals={retreat ? retreat.proposals : []}
                    selectProposal={(proposalId) => {
                      dispatch(getUserHome())
                    }}
                  />
                </Box>
              </Collapse>
            </Box>
          ),
        },
        ...(selectedProposal
          ? [
              {
                body: (
                  <Box>
                    <Typography variant="h3">Review payment</Typography>
                    <Collapse in={true}>
                      <RetreatPaymentReview
                        numEmployees={guests}
                        proposal={selectedProposal}
                        updateNumEmployees={() => undefined}
                      />
                    </Collapse>
                  </Box>
                ),

                state: "in-progress" as AppTimelineItemState,
              },
            ]
          : []),
        {
          body: (
            <Box>
              <RetreatNextStepsList />
            </Box>
          ),
          state: "todo",
        },
      ]}
    />
  )
}
