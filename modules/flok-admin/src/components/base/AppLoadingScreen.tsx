import {CircularProgress, makeStyles} from "@material-ui/core"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
}))

type AppLoadingScreenProps = {}
export default function AppLoadingScreen(props: AppLoadingScreenProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}
