import {makeStyles, Theme} from "@material-ui/core"
import {HitsProvided} from "react-instantsearch-core"
import {connectHits} from "react-instantsearch-dom"
import {DestinationAlgoliaHitModel} from "../../models/lodging"
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

interface DestinationsGridProps
  extends HitsProvided<DestinationAlgoliaHitModel> {
  isSelected: (hit: DestinationAlgoliaHitModel) => boolean
  onSelect: (hit: DestinationAlgoliaHitModel) => void
  onExplore: (hit: DestinationAlgoliaHitModel) => void
}

function DestinationsGrid(props: DestinationsGridProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      {props.hits.map((hit, index) => (
        <AppDestinationCard
          description={
            "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial areas."
          }
          title={hit.city}
          subtitle={`${hit.state}, ${hit.country}`}
          img={
            "https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg"
          }
          onExplore={() => props.onExplore(hit)}
          onSelect={() => props.onSelect(hit)}
          selected={props.isSelected(hit)}
          key={index}
        />
      ))}
    </div>
  )
}

export default connectHits<DestinationsGridProps, DestinationAlgoliaHitModel>(
  DestinationsGrid
)
