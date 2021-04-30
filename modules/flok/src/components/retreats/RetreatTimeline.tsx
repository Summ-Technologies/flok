import {Box, Collapse, makeStyles, Paper, Typography} from "@material-ui/core"
import {blue} from "@material-ui/core/colors"
import {ChatBubbleOutlineRounded} from "@material-ui/icons"
import React, {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import AppTimeline from "../../components/base/AppTimeline"
import AppTypography from "../../components/base/AppTypography"
import AppRetreatDetailsFilter from "../../components/retreats/RetreatDetailsFilter"
import RetreatProposalCardList from "../../components/retreats/RetreatProposalCardList"
import {RetreatModel, RetreatProposal} from "../../models/retreat"
import {
  deleteSelectedProposal,
  postSelectedProposal,
  putRetreatDetails,
} from "../../store/actions/retreat"
import AppButton from "../base/AppButton"
import AppTimelineItem from "../base/AppTimeline/AppTimelineItem"
import RetreatNextStepsList from "./RetreatNextStepsList"
import RetreatPaymentReview from "./RetreatPaymentReview"

const useStyles = makeStyles((theme) => ({
  chooseProposalBody: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(3),
    },
  },
  note: {
    backgroundColor: blue[50],
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
  let [state, setState] = useState<"choose" | "pay" | "paid">("choose")

  useEffect(() => {
    if (retreat.paid) {
      setState("paid")
    } else if (selectedProposal) {
      setState("pay")
    } else {
      setState("choose")
    }
  }, [retreat.paid, selectedProposal, setState])

  return (
    <AppTimeline>
      <AppTimelineItem
        order={1}
        key={"proposals"}
        state={state === "choose" ? "in-progress" : "completed"}
        body={
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
                    {state === "pay" ? (
                      <AppButton
                        onClick={() => {
                          dispatch(deleteSelectedProposal(retreat.id))
                        }}
                        variant="text"
                        color="primary">
                        Edit
                      </AppButton>
                    ) : undefined}
                  </>
                ) : undefined}
              </Typography>
            </Box>
            <Collapse in={state === "choose" ? true : false}>
              <Paper variant="outlined">
                <Box padding={4} className={classes.chooseProposalBody}>
                  {retreat.flokNote ? (
                    /* <Paper elevation={1} className={classes.note}> */
                    <Box width="100%" display="flex" padding={0}>
                      <Box marginRight={1}>
                        <ChatBubbleOutlineRounded fontSize="small" />
                      </Box>
                      <AppTypography variant="body1">
                        <Box component="span" fontWeight="fontWeightMedium">
                          Note from Flok:
                        </Box>{" "}
                        {retreat.flokNote}
                      </AppTypography>
                    </Box>
                  ) : /* </Paper> */
                  undefined}
                  <AppRetreatDetailsFilter
                    guests={retreat.numEmployees}
                    nights={retreat.numNights}
                    onUpdate={(g, n) => {
                      dispatch(putRetreatDetails(retreat.id, g, n))
                    }}
                  />

                  <Box>
                    <RetreatProposalCardList
                      numEmployees={retreat.numEmployees}
                      numNights={retreat.numNights}
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
        }
      />
      {state !== "choose" && selectedProposal ? (
        <AppTimelineItem
          order={2}
          key={"payment"}
          state={state === "pay" ? "in-progress" : "completed"}
          body={
            <Box>
              <Typography variant="h3">Pay Flok Fee</Typography>
              <Box marginTop={2}>
                {state === "pay" ? (
                  <RetreatPaymentReview
                    numEmployees={retreat.numEmployees}
                    proposal={selectedProposal}
                    numNights={retreat.numNights}
                    updateNumEmployees={(n) => {
                      dispatch(putRetreatDetails(retreat.id, n))
                    }}
                  />
                ) : undefined}
                {state === "paid" ? (
                  <Paper variant="outlined">
                    <Box width="100%" display="flex" padding={2}>
                      <Box marginRight={1}>
                        <ChatBubbleOutlineRounded fontSize="small" />
                      </Box>
                      <AppTypography variant="body1">
                        <Box component="span" fontWeight="fontWeightMedium">
                          Note from Flok:
                        </Box>
                        Thanks for paying. We'll be in contact with you soon!
                      </AppTypography>
                    </Box>
                  </Paper>
                ) : undefined}
              </Box>
            </Box>
          }
        />
      ) : undefined}
      <AppTimelineItem
        order={state === "choose" ? 2 : 3}
        key={"nextSteps"}
        body={
          <RetreatNextStepsList expanded={state === "paid" ? true : false} />
        }
        state="todo"
        lastItem
      />
    </AppTimeline>
  )
}
