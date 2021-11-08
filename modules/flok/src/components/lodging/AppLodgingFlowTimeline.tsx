import {makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  dot: {
    position: "relative",
    height: 10,
    width: 10,
    borderRadius: "50%",
    backgroundColor: theme.palette.grey[400],
    "&.active": {
      backgroundColor: theme.palette.primary.main,
    },
    "&.current": {
      backgroundColor: theme.palette.common.white,
      borderColor: theme.palette.primary.main,
      borderWidth: 1.5,
      borderStyle: "dashed",
      height: 18,
      width: 18,
    },
  },
  connector: {
    height: 0,
    width: 50,
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: theme.palette.grey[400],
    "&.active": {
      borderTopColor: theme.palette.primary.main,
    },
    "&.active.halfway": {
      borderTopStyle: "dotted",
    },
    "&.halfway": {
      width: 25,
    },
  },
  itemTitle: {
    position: "absolute",
    overflow: "visible",
    top: -30,
    left: -10,
    fontSize: 12,
    lineHeight: 1,
    textTransform: "uppercase",
    padding: `${4}px ${6}px`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: 3,
  },
  arrow: {
    visibility: "hidden",
    position: "absolute",
    bottom: -3,
    left: 11.5, // (width / 2) + (- itemTitle.left)
    "&, &::before": {
      position: "absolute",
      width: 6,
      height: 6,
    },
    "&::before": {
      visibility: "visible",
      content: '""',
      transform: "rotate(45deg)",
      backgroundColor: theme.palette.primary.main,
    },
  },
}))

type LodgingFlowStep =
  | "INTAKE_1"
  | "INTAKE_2"
  | "FILTER_SELECT"
  | "DESTINATION_SELECT"
  | "HOTEL_SELECT"
  | "PROPOSAL"
const ORDERED_STEPS: {step: LodgingFlowStep; title: string; half?: boolean}[] =
  [
    {step: "INTAKE_1", title: "Your Info"},
    {step: "INTAKE_2", title: "Retreat Info"},
    {step: "FILTER_SELECT", title: "Retreat Preferences"},
    {step: "DESTINATION_SELECT", title: "Destinations"},
    {step: "HOTEL_SELECT", title: "Request Proposals"},
    {step: "PROPOSAL", title: "View Proposals"},
  ]

type AppLodgingFlowTimelineProps = {
  currentStep: LodgingFlowStep
  halfway?: boolean
}
export default function AppLodgingFlowTimeline(
  props: AppLodgingFlowTimelineProps
) {
  let classes = useStyles(props)
  let currentStepNumber = ORDERED_STEPS.map((step) => step.step).indexOf(
    props.currentStep
  )
  let currentStep = ORDERED_STEPS[currentStepNumber]
  let lastStepIndex = ORDERED_STEPS.length - 1

  return (
    <div className={classes.root}>
      {ORDERED_STEPS.map((step, i) => (
        <React.Fragment key={i}>
          <div
            className={clsx(
              classes.dot,
              i < currentStepNumber ? "active" : undefined,
              i === currentStepNumber && !props.halfway ? "current" : undefined
            )}>
            {i === currentStepNumber && (
              <AppTypography
                noWrap
                align="center"
                className={classes.itemTitle}>
                {currentStep.title}
                <span className={classes.arrow}></span>
              </AppTypography>
            )}
          </div>
          {i < lastStepIndex ? (
            <>
              <div
                className={clsx(
                  classes.connector,
                  i + 1 <= currentStepNumber ? "active" : undefined,
                  i + 1 === currentStepNumber
                    ? props.halfway
                      ? "halfway"
                      : undefined
                    : undefined
                )}></div>
              {i + 1 === currentStepNumber && props.halfway ? (
                <div className={clsx(classes.connector, "halfway")}></div>
              ) : undefined}
            </>
          ) : undefined}
        </React.Fragment>
      ))}
    </div>
  )
}
