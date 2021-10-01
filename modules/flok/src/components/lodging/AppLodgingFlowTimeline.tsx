import {makeStyles, Popper} from "@material-ui/core"
import clsx from "clsx"
import React, {useEffect, useRef} from "react"
import AppTypography from "../base/AppTypography"

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
    borderTopColor: theme.palette.grey[200],
    "&.active": {
      borderTopColor: theme.palette.primary.main,
    },
  },
  popper: {
    padding: `${4}px ${6}px`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: 3,
    "&[x-out-of-boundaries]": {
      visibility: "hidden",
      pointerEvents: "none",
    },
  },
  itemTitle: {
    fontSize: 12,
    lineHeight: 1,
    textTransform: "uppercase",
  },
}))

type LodgingFlowStep =
  | "INTAKE_1"
  | "INTAKE_2"
  | "DESTINATION_SELECT"
  | "HOTEL_SELECT"
  | "PROPOSAL"
const ORDERED_STEPS: {step: LodgingFlowStep; title: string}[] = [
  {step: "INTAKE_1", title: "Your Info"},
  {step: "INTAKE_2", title: "Retreat Info"},
  {step: "DESTINATION_SELECT", title: "Destinations"},
  {step: "HOTEL_SELECT", title: "Request Proposals"},
  {step: "PROPOSAL", title: "View Proposals"},
]

type AppLodgingFlowTimelineProps = {
  currentStep: LodgingFlowStep
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
  const [dotEl, setDotEl] = React.useState<null | HTMLElement>(null)
  let dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dotRef.current) setDotEl(dotRef.current)
  }, [currentStepNumber])

  return (
    <div className={classes.root}>
      {ORDERED_STEPS.map((step, i) => (
        <>
          <div
            ref={currentStepNumber === i ? dotRef : undefined}
            className={clsx(
              classes.dot,
              i + 1 <= currentStepNumber ? "active" : undefined,
              i === currentStepNumber ? "current" : undefined
            )}></div>
          {i < lastStepIndex ? (
            <div
              className={clsx(
                classes.connector,
                i + 1 <= currentStepNumber ? "active" : undefined
              )}></div>
          ) : undefined}
          {i === currentStepNumber && (
            <Popper
              className={classes.popper}
              open
              anchorEl={dotEl}
              placement="top"
              modifiers={{
                hide: {
                  enabled: true,
                },
                offset: {
                  enabled: true,
                  offset: "0,8",
                },
                flip: {
                  enabled: false,
                },
              }}>
              <AppTypography className={classes.itemTitle}>
                {currentStep.title}
              </AppTypography>
            </Popper>
          )}
        </>
      ))}
    </div>
  )
}
