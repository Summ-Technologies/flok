import {List, makeStyles, Paper, StandardProps} from "@material-ui/core"
import React, {PropsWithChildren} from "react"

const useStyles = makeStyles((theme) => ({
  root: {},
}))

interface AppListProps extends StandardProps<{}, "root"> {}

export default function AppList(props: PropsWithChildren<AppListProps>) {
  const classes = useStyles()
  return (
    <Paper elevation={0} className={`${classes.root} ${props.className}`}>
      <List>{props.children}</List>
    </Paper>
  )
}
