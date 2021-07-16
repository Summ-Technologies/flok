import {List, makeStyles, Paper} from "@material-ui/core"
import React, {PropsWithChildren} from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: "100%",
    "& > hr": {
      width: `calc(100% - ${theme.spacing(4)}px)`,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
}))

type AppTodolistProps = PropsWithChildren<{}>
export default function AppTodolist(props: AppTodolistProps) {
  let classes = useStyles(props)
  return (
    <Paper className={classes.root}>
      <List>{props.children}</List>
    </Paper>
  )
}
