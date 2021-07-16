import {Divider, makeStyles} from "@material-ui/core"
import {FiberManualRecordOutlined} from "@material-ui/icons"
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
  stepContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
  },
  stepCircle: {},
  stepDivider: {
    flex: 1,
    minWidth: 150,
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: theme.spacing(3),
  },
  stepText: {},
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
          <div className={classes.step}>
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
