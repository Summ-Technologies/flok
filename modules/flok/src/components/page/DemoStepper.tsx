import {Button, makeStyles} from "@material-ui/core"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: 100,
    right: 100,
    zIndex: 10000,
    height: 100,
    width: 150,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& > *:not(:last-child)": {
      marginRight: 5,
    },
  },
}))

type DemoStepperProps = {
  setStep: (step: number) => void
  step: number
  maxStep: number
}
export default function DemoStepper(props: DemoStepperProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <Button
        variant="outlined"
        disabled={props.step === 1}
        onClick={() => props.setStep(props.step - 1)}>
        Previous
      </Button>
      <Button
        variant="outlined"
        disabled={props.step === props.maxStep}
        onClick={() => props.setStep(props.step + 1)}>
        Next
      </Button>
    </div>
  )
}
