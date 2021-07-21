import {Divider, makeStyles} from "@material-ui/core"
import {FiberManualRecordOutlined} from "@material-ui/icons"
import clsx from "clsx"
import React from "react"
import AppTypography from "./AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "nowrap",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
    paddingRight: theme.spacing(3),
  },
  stepInProgress: {
    "& $stepDivider": {
      borderBottomColor: theme.palette.primary.main,
    },
    "& $stepCircle": {
      color: theme.palette.primary.main,
    },
    "& $stepText": {
      color: theme.palette.text.primary,
    },
  },
  stepDone: {
    "& $stepDivider": {
      borderBottomColor: theme.palette.primary.main,
      borderBottomStyle: "solid",
    },
    "& $stepCircle": {
      color: theme.palette.primary.main,
    },
    "& $stepText": {
      color: theme.palette.text.primary,
    },
  },
  stepContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
  },
  stepCircle: {
    color: theme.palette.primary.light,
  },
  stepDivider: {
    flex: 1,
    minWidth: 150,
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: theme.spacing(2),
    borderBottomWidth: "2px",
    borderBottomStyle: "dashed",
    borderBottomColor: theme.palette.primary.light,
    backgroundColor: "unset",
  },
  stepText: {
    color: theme.palette.text.disabled,
  },
}))

type AppProgressStepperProps = {
  steps: {name: string; progress: "TODO" | "IN-PROGRESS" | "DONE"}[]
}
export default function AppProgressStepper(props: AppProgressStepperProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      {props.steps.map((step, stepIndex) => {
        let lastStep = stepIndex === props.steps.length - 1
        return (
          <div
            className={clsx(
              classes.step,
              step.progress === "IN-PROGRESS"
                ? classes.stepInProgress
                : step.progress === "DONE"
                ? classes.stepDone
                : undefined
            )}>
            <div className={classes.stepContainer}>
              <div className={classes.stepCircle}>
                <FiberManualRecordOutlined />
              </div>
              {!lastStep ? <Divider className={classes.stepDivider} /> : <></>}
            </div>
            <div className={classes.stepText}>
              <AppTypography variant="body2" noWrap>
                {step.name}
              </AppTypography>
            </div>
          </div>
        )
      })}
    </div>
  )
}
