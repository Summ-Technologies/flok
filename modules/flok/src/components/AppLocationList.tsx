import {
  Box,
  Divider,
  IconButton,
  makeStyles,
  StandardProps,
  Typography,
} from "@material-ui/core"
import {DeleteRounded} from "@material-ui/icons"
import clsx from "clsx"
import React, {PropsWithChildren} from "react"
import {RetreatEmployeeLocationItem} from "../models/retreat"
import AppList, {AppListItem} from "./base/AppList"
import AppNumberCounter from "./base/AppNumberCounter"

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
    <AppList elevation={2} className={clsx(classes.root, otherProps.className)}>
      <AppListItem
        header={
          <Typography variant="body1">
            <Box component="span" fontWeight="fontWeightMedium">
              Locations
            </Box>
          </Typography>
        }
        body={
          <Typography variant="body1">
            <Box component="span" fontWeight="fontWeightMedium">
              # of people
            </Box>
          </Typography>
        }
      />
      <Divider />
      {locations.map((location, i) => {
        return (
          <React.Fragment key={location.googlePlaceId}>
            <AppListItem
              header={location.mainText}
              subheader={location.secondaryText}
              body={
                <AppNumberCounter
                  count={location.employeeCount ? location.employeeCount : 1}
                  onUpdateCount={
                    onSetLocationNumber
                      ? (count) =>
                          onSetLocationNumber
                            ? onSetLocationNumber(location, count)
                            : undefined
                      : undefined
                  }
                  min={1}
                />
              }
              action={
                <IconButton
                  size="small"
                  onClick={
                    onRemoveLocation
                      ? () =>
                          onRemoveLocation
                            ? onRemoveLocation(location)
                            : undefined
                      : undefined
                  }
                  disabled={!onRemoveLocation}>
                  <DeleteRounded />
                </IconButton>
              }
            />
            {i < locations.length - 1 ? <Divider /> : undefined}
          </React.Fragment>
        )
      })}
    </AppList>
  )
}
