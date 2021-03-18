import {
  Box,
  Divider,
  Hidden,
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
import React, {PropsWithChildren} from "react"
import {EmployeeLocation} from "../data/locations"

type AppLocationListRowProps = {
  classes: {row: any; employeeCount: any}
  count: number
  header: string
  secondary?: string
  onRemoveItem: () => void
  onUpdateCount: (newCount: number) => void
}

function AppLocationListRowItem(
  props: PropsWithChildren<AppLocationListRowProps>
) {
  return (
    <ListItem className={`${props.classes.row}`}>
      <ListItemText
        secondary={
          props.secondary ? (
            <Typography variant="body2">{props.secondary}</Typography>
          ) : undefined
        }>
        <Typography variant="body1">{props.header}</Typography>
      </ListItemText>
      <Box className={props.classes.employeeCount}>
        <IconButton
          size="small"
          onClick={() => props.onUpdateCount(props.count - 1)}
          disabled={props.count === 1}>
          <IndeterminateCheckBoxOutlined />
        </IconButton>
        <Typography variant="body1">{props.count}</Typography>
        <IconButton
          size="small"
          onClick={() => props.onUpdateCount(props.count + 1)}>
          <AddBoxOutlined />
        </IconButton>
      </Box>
      <ListItemSecondaryAction>
        <IconButton size="small" onClick={props.onRemoveItem}>
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
  locations: {location: EmployeeLocation; number: number}[]
  onRemoveLocation: (location: EmployeeLocation) => void
  onSetLocationNumber: (location: EmployeeLocation, val: number) => void
}

export default function AppLocationList(
  props: PropsWithChildren<AppLocationListProps>
) {
  const classes = useStyles()
  return (
    <Paper elevation={0} className={`${classes.root}`}>
      <List>
        <ListItem className={`${classes.row}`}>
          <ListItemText>
            <Typography variant="body1">
              <Box fontWeight="fontWeightMedium">Locations</Box>
            </Typography>
          </ListItemText>
          <Typography variant="body1">
            <Box
              fontWeight="fontWeightMedium"
              className={classes.employeeCount}>
              # of people
            </Box>
          </Typography>
          <ListItemSecondaryAction>
            <Hidden xsUp>
              <DeleteRounded />
            </Hidden>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        {props.locations.map((location, i) => {
          let header = location.location.name
            ? location.location.name
            : location.location.city
          let subheader = ""
          if (!header) {
            header = location.location.country
          } else {
            subheader = location.location.country
          }
          return (
            <>
              <AppLocationListRowItem
                onUpdateCount={(count) =>
                  props.onSetLocationNumber(location.location, count)
                }
                onRemoveItem={() => props.onRemoveLocation(location.location)}
                header={header}
                secondary={subheader}
                count={location.number}
                classes={classes}
              />
              {i < props.locations.length - 1 ? <Divider /> : undefined}
            </>
          )
        })}
      </List>
    </Paper>
  )
}
