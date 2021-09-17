import {makeStyles, Theme} from "@material-ui/core"
import {DestinationModel} from "../../models/lodging"
import AppDestinationCard from "./AppDestinationCard"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    "& > *": {
      margin: theme.spacing(1.5),
    },
  },
}))

type DestinationsGridProps = {
  destinations: DestinationModel[]
  isSelected: (destination: DestinationModel) => boolean
  onSelect: (destination: DestinationModel) => void
  onExplore: (destination: DestinationModel) => void
}

export default function DestinationsGrid(props: DestinationsGridProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      {props.destinations.map((destination, index) => {
        let subtitle = destination.state
          ? `${destination.state}, ${destination.country_abbreviation}`
          : `${destination.country}`
        return (
          <AppDestinationCard
            description={destination.description_short}
            title={destination.location}
            subtitle={subtitle}
            img={destination.spotlight_img.image_url}
            onExplore={() => props.onExplore(destination)}
            onSelect={() => props.onSelect(destination)}
            selected={props.isSelected(destination)}
            key={index}
          />
        )
      })}
    </div>
  )
}
