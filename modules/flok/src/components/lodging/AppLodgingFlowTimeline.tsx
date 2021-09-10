import {makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: "50%",
    backgroundColor: theme.palette.grey[200],
    "&.active": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  connector: {
    height: 0,
    width: 50,
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: theme.palette.grey[200],
    "&.active": {
      borderTopColor: theme.palette.primary.main,
    },
  },
}))

type LodgingFlowStep =
  | "INTAKE_FORM"
  | "SELECT_DESTINATION"
  | "SELECT_HOTEL_RFPS"
  | "REVIEW_HOTEL_RFPS"
  | "BOOK_HOTEL"
const ORDERED_STEPS: LodgingFlowStep[] = [
  "INTAKE_FORM",
  "SELECT_DESTINATION",
  "SELECT_HOTEL_RFPS",
  "REVIEW_HOTEL_RFPS",
  "BOOK_HOTEL",
]

type AppLodgingFlowTimelineProps = {
  currentStep: LodgingFlowStep
}
export default function AppLodgingFlowTimeline(
  props: AppLodgingFlowTimelineProps
) {
  let classes = useStyles(props)
  let currentStepNumber = ORDERED_STEPS.indexOf(props.currentStep)
  let lastStepIndex = ORDERED_STEPS.length - 1
  return (
    <div className={classes.root}>
      {ORDERED_STEPS.map((step, i) => (
        <>
          <div
            className={clsx(
              classes.dot,
              i <= currentStepNumber ? "active" : undefined
            )}></div>
          {i < lastStepIndex ? (
            <div
              className={clsx(
                classes.connector,
                i + 1 <= currentStepNumber ? "active" : undefined
              )}></div>
          ) : undefined}
        </>
      ))}
    </div>
  )
}
