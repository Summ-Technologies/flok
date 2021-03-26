import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  StandardProps,
  Typography,
} from "@material-ui/core"
import {
  AddBoxOutlined,
  DeleteRounded,
  IndeterminateCheckBoxOutlined,
} from "@material-ui/icons"
import clsx from "clsx"
import React, {PropsWithChildren} from "react"
import {RetreatEmployeeLocationItem} from "../models/retreat"

const useRowStyles = makeStyles((theme) => ({
  root: {
    "& *:disabled": {
      cursor: "not-allowed",
      pointerEvents: "unset",
    },
  },
}))

interface AppLocationListRowProps
  extends StandardProps<{}, "root" | "employeeCount"> {
  count: number
  header: string
  secondary?: string
  onRemoveItem?: () => void
  onUpdateCount?: (newCount: number) => void
}

function AppLocationListRowItem(
  props: PropsWithChildren<AppLocationListRowProps>
) {
  let classes = useRowStyles()
  let minusButtonDisabled = !props.onUpdateCount || props.count === 1
  let plusButtonDisabled = !props.onUpdateCount
  let trashButtonDisabled = !props.onRemoveItem

  return (
    <ListItem className={clsx(classes.root, props.classes?.root)}>
      <ListItemText
        secondary={
          <Typography variant="body2">
            {props.secondary ? props.secondary : "\u200B"}
          </Typography>
        }>
        <Typography variant="body1">{props.header}</Typography>
      </ListItemText>
      <Box className={props.classes?.employeeCount}>
        <IconButton
          size="small"
          onClick={() =>
            props.onUpdateCount
              ? props.onUpdateCount(props.count - 1)
              : undefined
          }
          disabled={minusButtonDisabled}>
          <IndeterminateCheckBoxOutlined />
        </IconButton>
        <Typography variant="body1">{props.count}</Typography>
        <IconButton
          size="small"
          onClick={() =>
            props.onUpdateCount
              ? props.onUpdateCount(props.count + 1)
              : undefined
          }
          disabled={plusButtonDisabled}>
          <AddBoxOutlined />
        </IconButton>
      </Box>
      <ListItemSecondaryAction className={classes.root}>
        <IconButton
          size="small"
          onClick={props.onRemoveItem}
          disabled={trashButtonDisabled}>
          <DeleteRounded />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  row: {
    justifyContent: "center",
  },
  employeeCount: {
    marginRight: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "nowrap",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
}))

interface AppLocationListProps extends StandardProps<{}, "root"> {
  locations: RetreatEmployeeLocationItem[]
  onRemoveLocation?: (location: RetreatEmployeeLocationItem) => void
  onSetLocationNumber?: (
    location: RetreatEmployeeLocationItem,
    val: number
  ) => void
}

export default function AppLocationList(
  props: PropsWithChildren<AppLocationListProps>
) {
  const classes = useStyles()
  let {locations, onSetLocationNumber, onRemoveLocation, ...otherProps} = props
  return (
    <Paper elevation={0} className={clsx(classes.root, otherProps.className)}>
      <List>
        <ListItem className={`${classes.row}`}>
          <ListItemText>
            <Typography variant="body1">
              <Box component="span" fontWeight="fontWeightMedium">
                Locations
              </Box>
            </Typography>
          </ListItemText>
          <Typography variant="body1">
            <Box
              component="span"
              fontWeight="fontWeightMedium"
              className={classes.employeeCount}>
              # of people
            </Box>
          </Typography>
          <ListItemSecondaryAction />
        </ListItem>
        <Divider />
        {locations.map((location, i) => {
          return (
            <React.Fragment key={location.googlePlaceId}>
              <AppLocationListRowItem
                onUpdateCount={
                  onSetLocationNumber
                    ? (count) =>
                        onSetLocationNumber
                          ? onSetLocationNumber(location, count)
                          : undefined
                    : undefined
                }
                onRemoveItem={
                  onRemoveLocation
                    ? () =>
                        onRemoveLocation
                          ? onRemoveLocation(location)
                          : undefined
                    : undefined
                }
                header={location.mainText}
                secondary={location.secondaryText}
                count={location.employeeCount ? location.employeeCount : 0}
                classes={{
                  root: classes.row,
                  employeeCount: classes.employeeCount,
                }}
              />
              {i < locations.length - 1 ? <Divider /> : undefined}
            </React.Fragment>
          )
        })}
      </List>
    </Paper>
  )
}
