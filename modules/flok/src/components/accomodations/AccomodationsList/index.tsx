import {List, makeStyles} from "@material-ui/core"
import {AccomodationModel} from "../../../models/accomodation"
import AccomodationsListItem from "./AccomodationsListItem"

let useStyles = makeStyles((theme) => ({
  root: {},
}))

type AccomodationsListProps = {
  accomodations: {[key: number]: AccomodationModel}
  onClickRow: (id: number) => void
}

export default function AccomodationsList(props: AccomodationsListProps) {
  let classes = useStyles(props)
  return (
    <List className={classes.root}>
      {Object.values(props.accomodations).map((acc) => (
        <AccomodationsListItem
          onClick={() => props.onClickRow(acc.id)}
          airport={acc.airport}
          city={acc.city}
          employees={acc.employees}
          img={acc.img}
          name={acc.name}
          pricing={acc.pricing}
          key={acc.id}
        />
      ))}
    </List>
  )
}
