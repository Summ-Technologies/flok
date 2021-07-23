import {ListItem, ListItemText, makeStyles} from "@material-ui/core"
import {LockRounded} from "@material-ui/icons"
import clsx from "clsx"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  locked: {
    color: theme.palette.text.disabled,
  },
  completed: {
    color: theme.palette.text.secondary,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
    width: "100%",
    justifyContent: "space-between",
  },
  headerText: {
    minWidth: 0, // to allow text ellipsis
  },
  cta: {
    display: "flex",
    alignItems: "center",
  },
  body: {
    marginTop: theme.spacing(1),
  },
}))

type TodoListItemState = "DEFAULT" | "LOCKED" | "COMPLETED"
type AppTodolistItemProps = {
  state?: TodoListItemState

  header: string
  subheader: string
  body?: JSX.Element
  cta?: JSX.Element // in most cases the CTA should be built into the "body" of the item and not here
}
export default function AppTodolistItem(props: AppTodolistItemProps) {
  let classes = useStyles(props)
  return (
    <ListItem
      className={clsx(
        classes.root,
        props.state === "LOCKED" ? classes.locked : undefined,
        props.state === "COMPLETED" ? classes.completed : undefined
      )}>
      <ListItemText>
        <div className={classes.header}>
          <div className={classes.headerText}>
            <AppTypography variant="h5" noWrap>
              {props.header}
            </AppTypography>
            <AppTypography variant="body1" noWrap>
              {props.subheader ? props.subheader : <>&nbsp;</>}
            </AppTypography>
          </div>
          {props.state === "LOCKED" ? (
            <div className={classes.cta}>
              <LockRounded fontSize="small" />
            </div>
          ) : props.cta ? (
            <div className={classes.cta}>{props.cta}</div>
          ) : undefined}
        </div>
        {props.body ? <div className={classes.body}>{props.body}</div> : <></>}
      </ListItemText>
    </ListItem>
  )
}
