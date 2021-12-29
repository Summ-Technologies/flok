import {Link, makeStyles} from "@material-ui/core"
import {Check, FiberManualRecord, Lock} from "@material-ui/icons"
import clsx from "clsx"
import React, {PropsWithChildren} from "react"
import {RetreatToTaskState} from "../../models/retreat"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  completed: {
    textDecoration: "line-through",
  },
  next: {
    color: theme.palette.grey[500],
  },
  endIcon: {
    marginLeft: theme.spacing(1),
  },
  radioBtn: {
    marginRight: theme.spacing(2),
  },
}))

type AppTaskListItemProps = {
  description: string
  link?: string
  state: RetreatToTaskState
}
export function AppTaskListItem(props: AppTaskListItemProps) {
  let classes = useStyles(props)
  return (
    <div
      className={clsx(
        classes.root,
        props.state === "COMPLETED" ? classes.completed : undefined,
        props.state === "NEXT" ? classes.next : undefined
      )}>
      <FiberManualRecord className={classes.radioBtn} fontSize="inherit" />
      <div>
        <AppTypography variant="body1">
          {props.description}
          {props.state === "NEXT" && (
            <Lock className={classes.endIcon} fontSize="inherit" />
          )}
          {props.state === "COMPLETED" && (
            <Check className={classes.endIcon} fontSize="inherit" />
          )}
        </AppTypography>
        {props.link && props.state === "TODO" && (
          <Link href={props.link}>Complete</Link>
        )}
      </div>
    </div>
  )
}

let useListStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
}))

export function AppTaskList(props: PropsWithChildren<{}>) {
  let classes = useListStyles(props)
  return <div className={classes.root}>{props.children}</div>
}
