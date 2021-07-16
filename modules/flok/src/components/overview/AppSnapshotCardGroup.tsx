import {makeStyles} from "@material-ui/core"
import {
  FlightRounded,
  HomeRounded,
  PeopleRounded,
  RoomRounded,
} from "@material-ui/icons"
import React, {PropsWithChildren} from "react"
import AppSnapshotCard from "./AppSnapshotCard"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    "& > div": {
      maxWidth: "100%",
      display: "flex",
      flex: 1,
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  },
}))

type AppSnapshotCardGroupProps = PropsWithChildren<{}>
export default function AppSnapshotCardGroup(props: AppSnapshotCardGroupProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div>
        <AppSnapshotCard
          header="Destination"
          value="Berlin, Germany"
          Icon={RoomRounded}
        />
        <AppSnapshotCard
          header="Lodging"
          value="The Ritz-Carlton"
          Icon={HomeRounded}
        />
      </div>
      <div>
        <AppSnapshotCard header="Attendees" value="34" Icon={PeopleRounded} />
        <AppSnapshotCard header="Flights Booked" Icon={FlightRounded} />
      </div>
    </div>
  )
}
