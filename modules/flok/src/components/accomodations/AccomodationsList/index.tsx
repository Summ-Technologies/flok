import {Divider, List, ListItem, makeStyles} from "@material-ui/core"
import {AccomodationModel, DestinationModel} from "../../../models/accomodation"
import AppTypography from "../../base/AppTypography"
import AccomodationsListItem from "./AccomodationsListItem"

let useStyles = makeStyles((theme) => ({
  root: {},
  divider: {},
}))

type AccomodationsListProps = {
  destinations: {[key: number]: DestinationModel}
  accomodations: {[key: number]: AccomodationModel}
  selectedDestination?: number
}

export default function AccomodationsList(props: AccomodationsListProps) {
  let classes = useStyles(props)
  return (
    <List className={classes.root}>
      {Object.values(props.destinations)
        .filter((dest) =>
          props.selectedDestination !== undefined
            ? dest.id === props.selectedDestination
            : true
        )
        .map((dest) => {
          return (
            <>
              <ListItem className="destination-header">
                <AppTypography variant="h3">{dest.name}</AppTypography>
              </ListItem>
              {Object.values(props.accomodations)
                .filter((acc) => acc.destinationId === dest.id)
                .map((acc) => (
                  <>
                    <AccomodationsListItem
                      airport={acc.airport}
                      city={acc.city}
                      employees={acc.employees}
                      img={acc.img}
                      name={acc.name}
                      pricing={acc.pricing}
                      key={acc.id}
                    />
                    <Divider className={classes.divider} />
                  </>
                ))}
            </>
          )
        })}
    </List>
  )
}
