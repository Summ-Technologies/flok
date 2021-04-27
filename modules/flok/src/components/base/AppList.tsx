import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListProps,
  makeStyles,
  Paper,
  PaperProps,
  Typography,
} from "@material-ui/core"
import React, {PropsWithChildren} from "react"

const useStyles = makeStyles((theme) => ({
  root: {},
}))

interface AppListProps extends PaperProps {
  listProps?: ListProps
}

export default function AppList(props: PropsWithChildren<AppListProps>) {
  const classes = useStyles()
  let {listProps, ...paperProps} = {...props}
  return (
    <Paper
      elevation={0}
      {...paperProps}
      className={`${classes.root} ${props.className}`}>
      <List {...listProps}>{props.children}</List>
    </Paper>
  )
}

const useItemStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    "& *:disabled": {
      cursor: "not-allowed",
      pointerEvents: "unset",
    },
  },
}))

type AppListItemProps = {
  header?: JSX.Element | string
  subheader?: JSX.Element | string
  body?: JSX.Element
  action?: JSX.Element
}

export function AppListItem(props: AppListItemProps) {
  let classes = useItemStyles()
  let ItemHeader =
    typeof props.header === "string" ? (
      <Typography variant="body1">{props.header}</Typography>
    ) : (
      props.header
    )

  let ItemSubheader =
    typeof props.subheader === "string" ? (
      <Typography variant="body2">{props.subheader}</Typography>
    ) : (
      props.subheader
    )
  let ItemBody =
    typeof props.body === "string" ? (
      <Typography variant="body1">{props.body}</Typography>
    ) : (
      props.body
    )
  return (
    <ListItem className={classes.root}>
      {ItemSubheader || ItemHeader ? (
        <ListItemText secondary={ItemSubheader}>{ItemHeader}</ListItemText>
      ) : undefined}
      {ItemBody ? (
        <Box marginRight={props.action ? 2 : undefined}>{ItemBody}</Box>
      ) : undefined}
      {props.action ? (
        <ListItemSecondaryAction>{props.action}</ListItemSecondaryAction>
      ) : undefined}
    </ListItem>
  )
}
