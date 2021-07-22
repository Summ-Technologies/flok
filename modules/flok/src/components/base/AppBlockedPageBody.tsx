import {Button, makeStyles, Paper} from "@material-ui/core"
import {CheckRounded, PriorityHighRounded} from "@material-ui/icons"
import React from "react"
import AppAvatar from "./AppAvatar"
import AppTypography from "./AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    minWidth: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    maxWidth: 400,
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  steps: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    "& .step": {
      display: "flex",
      alignItems: "center",
    },
    "& .step > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
    "& .step:not(:last-child)": {
      marginRight: theme.spacing(4),
    },
  },
  cta: {},
}))

type BlockerStepType = {title: string; body: string; status: "TODO" | "DONE"}
type AppBlockedPageBodyProps = {
  title: string
  subheader: string
  steps: [BlockerStepType, BlockerStepType?]
}
export default function AppBlockedPageBody(props: AppBlockedPageBodyProps) {
  let classes = useStyles(props)
  function getStep(step: BlockerStepType) {
    return (
      <div className="step">
        <AppTypography variant="body1" fontWeight="bold">
          {step.title}
        </AppTypography>
        <AppTypography variant="body1">
          {step.status === "DONE" ? (
            <AppAvatar size="sm" color="success">
              <CheckRounded fontSize="small" />
            </AppAvatar>
          ) : (
            <AppAvatar size="sm" color="warning">
              <PriorityHighRounded fontSize="small" />
            </AppAvatar>
          )}
        </AppTypography>
        <AppTypography variant="body1">{step.body}</AppTypography>
      </div>
    )
  }
  return (
    <Paper className={classes.root}>
      <div className={classes.body}>
        <AppTypography variant="h4">{props.title}</AppTypography>
        <AppTypography variant="body1">{props.subheader}</AppTypography>
      </div>
      <div className={classes.steps}>
        {getStep(props.steps[0])}
        {props.steps[1] ? getStep(props.steps[1]) : undefined}
      </div>
      <Button
        variant="outlined"
        color="primary"
        size="large"
        className={classes.steps}>
        Back to overview
      </Button>
    </Paper>
  )
}
