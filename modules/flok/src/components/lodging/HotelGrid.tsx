import {makeStyles, Theme} from "@material-ui/core"
import {HitsProvided} from "react-instantsearch-core"
import {connectHits} from "react-instantsearch-dom"
import {HotelAlgoliaHitModel} from "../../models/lodging"
import AppFilter, {AppFilterProps} from "../base/AppFilter"
import AppHotelCard from "./AppHotelCard"

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

interface HotelGridProps extends HitsProvided<HotelAlgoliaHitModel> {
  isSelected: (hit: HotelAlgoliaHitModel) => boolean
  onSelect: (hit: HotelAlgoliaHitModel) => void
  onExplore: (hit: HotelAlgoliaHitModel) => void
}

function HotelGrid(props: HotelGridProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      {props.hits.map((hit, index) => (
        <AppHotelCard
          budget={2}
          description={""}
          destination={""}
          img={
            "https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg"
          }
          name={hit.hotel_name}
          rooms={100}
          stars={4}
          key={index}
          onExplore={() => props.onExplore(hit)}
          onSelect={() => props.onSelect(hit)}
          selected={props.isSelected(hit)}
        />
      ))}
    </div>
  )
}

export default connectHits<HotelGridProps, HotelAlgoliaHitModel>(HotelGrid)

const useFilterStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}))
type HotelGridFiltersProps = {filters: AppFilterProps[]}
export function HotelGridFilters(props: HotelGridFiltersProps) {
  let classes = useFilterStyles(props)
  return (
    <div className={classes.root}>
      {props.filters.map((filter) => {
        return <AppFilter {...filter} />
      })}
    </div>
  )
}
