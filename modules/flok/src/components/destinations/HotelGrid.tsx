import {makeStyles, Theme} from "@material-ui/core"
import {HitsProvided} from "react-instantsearch-core"
import {connectHits} from "react-instantsearch-dom"
import {HotelAlgoliaHitModel} from "../../models/lodging"

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

interface HotelGridProps 
  extends HitsProvided<HotelAlgoliaHitModel> {
  isSelected: (hit: HotelAlgoliaHitModel) => boolean
  onSelect: (hit: HotelAlgoliaHitModel) => void
  onExplore: (hit: HotelAlgoliaHitModel) => void
}

function HotelGrid(props: HotelGridProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      {props.hits.map((hit, index) => (
        <>{hit.hotel_name} {hit.location}</>
      ))}
    </div>
  )
}

export default connectHits<HotelGridProps, HotelAlgoliaHitModel>(
  HotelGrid
)
