import {List, makeStyles, Paper} from "@material-ui/core"
import React, {PropsWithChildren} from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}))

type AppListProps = {}

export default function AppList(props: PropsWithChildren<AppListProps>) {
  const classes = useStyles()
  return (
    <Paper elevation={0} className={`${classes.root}`}>
      <List>{props.children}</List>
    </Paper>
  )
}
