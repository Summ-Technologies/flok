import {
  ButtonBaseTypeMap,
  IconButton,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core"
import {ArrowDropDownRounded, ArrowDropUpRounded} from "@material-ui/icons"
import React, {useState} from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
  headerAction: {},
  body: {
    marginTop: theme.spacing(1),
  },
}))

type AppTodolistItemProps = {
  header: string
  subheader: string
  body?: JSX.Element

  completed?: boolean
  quickAction?: ButtonBaseTypeMap | "lock"
}
export default function AppTodolistItem(props: AppTodolistItemProps) {
  let classes = useStyles(props)
  let [expanded, setExpanded] = useState(false)
  return (
    <ListItem className={classes.root}>
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
          <div className={classes.headerAction}>
            {expanded ? (
              <IconButton size="small" onClick={() => setExpanded(false)}>
                <ArrowDropUpRounded fontSize="large" />
              </IconButton>
            ) : (
              <IconButton size="small" onClick={() => setExpanded(true)}>
                <ArrowDropDownRounded fontSize="large" />
              </IconButton>
            )}
          </div>
        </div>
        {props.body && expanded ? (
          <div className={classes.body}>{props.body}</div>
        ) : (
          <></>
        )}
      </ListItemText>
    </ListItem>
  )
}
