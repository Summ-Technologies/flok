import {Box, Collapse, makeStyles, Paper, Typography} from "@material-ui/core"
import {ChatBubbleOutlineRounded} from "@material-ui/icons"
import React, {useState} from "react"
import {useDispatch} from "react-redux"
import AppTimeline from "../../components/base/AppTimeline"
import AppTypography from "../../components/base/AppTypography"
import AppRetreatDetailsFilter from "../../components/retreats/RetreatDetailsFilter"
import RetreatProposalCardList from "../../components/retreats/RetreatProposalCardList"
import {RetreatModel, RetreatProposal} from "../../models/retreat"
import {
  deleteSelectedProposal,
  postSelectedProposal,
} from "../../store/actions/retreat"
import AppButton from "../base/AppButton"
import {AppTimelineItemState} from "../base/AppTimeline/AppTimelineItem"
import RetreatNextStepsList from "./RetreatNextStepsList"
import RetreatPaymentReview from "./RetreatPaymentReview"

const useStyles = makeStyles((theme) => ({
  chooseProposalBody: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(3),
    },
  },
  note: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.black,
  },
}))

type RetreatTimelineProps = {
  retreat: RetreatModel
  selectedProposal?: RetreatProposal
}
export default function RetreatTimeline(props: RetreatTimelineProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let {retreat, selectedProposal} = {...props}
  let [guests, setGuests] = useState(5)
  let [nights, setNights] = useState(5)

  return (
    <AppTimeline
      items={[
        {
          state: selectedProposal ? "completed" : "in-progress",
          body: (
            <Box>
              <Box>
                <Typography variant="h3">
                  Choose proposal
                  {selectedProposal ? (
                    <>
                      <Box component="span" fontWeight="fontWeightRegular">
                        {" "}
                        ({selectedProposal.title})
                      </Box>
                      <AppButton
                        onClick={() => {
                          dispatch(deleteSelectedProposal(retreat.id))
                        }}
                        variant="text"
                        color="primary">
                        Edit
                      </AppButton>
                    </>
                  ) : undefined}
                </Typography>
              </Box>
              <Collapse in={selectedProposal ? false : true}>
                <Paper variant="outlined">
                  <Box padding={4} className={classes.chooseProposalBody}>
                    {/* <Paper elevation={1} className={classes.note}> */}
                    <Box width="100%" display="flex" padding={0}>
                      <Box marginRight={1}>
                        <ChatBubbleOutlineRounded fontSize="small" />
                      </Box>
                      <AppTypography variant="body1">
                        <Box component="span" fontWeight="fontWeightMedium">
                          Note from Flok:{" "}
                        </Box>
                      </AppTypography>
                    </Box>
                    {/* </Paper> */}
                    <AppRetreatDetailsFilter
                      guests={guests}
                      nights={nights}
                      setGuests={(val) => setGuests(val)}
                      setNights={(val) => setNights(val)}
                    />

                    <Box>
                      <RetreatProposalCardList
                        numEmployees={guests}
                        numNights={nights}
                        proposals={retreat ? retreat.proposals : []}
                        selectProposal={(proposalId) => {
                          dispatch(postSelectedProposal(retreat.id, proposalId))
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
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
                      <Box marginTop={2}>
                        <RetreatPaymentReview
                          numEmployees={guests}
                          proposal={selectedProposal}
                          updateNumEmployees={() => undefined}
                        />
                      </Box>
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
