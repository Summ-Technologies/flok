import {
  Button,
  Checkbox,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core"
import {PropsWithChildren, useEffect, useRef} from "react"
import {DestinationModel, HotelModel} from "../../models/lodging"
import {DestinationUtils, useDestinations} from "../../utils/lodgingUtils"
import AppFilter, {AppFilterProps} from "../base/AppFilter"
import {AppSliderInput} from "../base/AppSliderInputs"
import AppTypography from "../base/AppTypography"
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

type HotelGridProps = {
  onReachEnd: () => void
  hotels: HotelModel[]
  isSelected: (hotel: HotelModel) => boolean
  onSelect: (hotel: HotelModel) => void
  onExplore: (hotel: HotelModel) => void
}

export default function HotelGrid(props: HotelGridProps) {
  let classes = useStyles(props)
  const {onReachEnd} = props
  let sentinelRef = useRef<HTMLLIElement>(null)
  let [destinations] = useDestinations()

  useEffect(() => {
    function loadMoreHotels(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onReachEnd()
        }
      })
    }
    let observer = new IntersectionObserver(loadMoreHotels)
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }
    return () => observer.disconnect()
  }, [onReachEnd])

  return (
    <div className={classes.root}>
      {props.hotels.map((hotel, index) => {
        let destination = destinations[hotel.destination_id]
        let destinationText = destination
          ? `${destination.location}, ${
              destination.state_abbreviation || destination.country_abbreviation
            }`
          : ""
        return (
          <AppHotelCard
            budget={
              hotel.price && hotel.price.length <= 4
                ? (hotel.price.length as 1 | 2 | 3 | 4)
                : 3
            }
            description={hotel.description_short}
            destination={destinationText}
            img={hotel.spotlight_img.image_url}
            name={hotel.name}
            rooms={hotel.num_rooms}
            stars={hotel.rating}
            key={index}
            onExplore={() => props.onExplore(hotel)}
            onSelect={() => props.onSelect(hotel)}
            selected={props.isSelected(hotel)}
          />
        )
      })}
      <li ref={sentinelRef} />
    </div>
  )
}

const useFilterStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))
type HotelGridFiltersProps = PropsWithChildren<{filters: AppFilterProps[]}>
export function HotelGridFilters(props: HotelGridFiltersProps) {
  let classes = useFilterStyles(props)
  return (
    <div className={classes.root}>
      {props.filters.map((filter) => {
        return <AppFilter {...filter} />
      })}
      {props.children}
    </div>
  )
}

const useFilterBodyStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    padding: theme.spacing(2),
    minWidth: 200,
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    textAlign: "left",
  },
  checkBoxOptionList: {
    width: "100%",
    maxHeight: 300,
    overflow: "auto",
  },
  checkBoxOption: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  ctaContainer: {
    display: "flex",
    width: "100%",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

export function HotelGridLocationFilterBody(props: {
  locations: DestinationModel[]
  selected: number[]
  setSelected: (selected: number[]) => void
  onClose: () => void
}) {
  let classes = useFilterBodyStyles(props)
  return (
    <Paper className={classes.root}>
      <AppTypography
        className={classes.header}
        variant="body1"
        fontWeight="bold">
        Destinations
      </AppTypography>
      <div className={classes.checkBoxOptionList}>
        {props.locations.map((curr) => (
          <div className={classes.checkBoxOption}>
            <Checkbox
              color="primary"
              checked={props.selected.includes(curr.id)}
              onChange={() => {
                if (props.selected.includes(curr.id)) {
                  props.setSelected(
                    props.selected.filter((val) => val !== curr.id)
                  )
                } else {
                  props.setSelected([...props.selected, curr.id])
                }
              }}
            />
            <ListItemText primary={DestinationUtils.getLocationName(curr)} />
          </div>
        ))}
      </div>
      <div className={classes.ctaContainer}>
        <Button
          size="small"
          variant="outlined"
          disabled={props.selected.length === 0}
          onClick={() => props.setSelected([])}>
          Clear
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={props.onClose}>
          Done
        </Button>
      </div>
    </Paper>
  )
}

export function HotelGridRoomsFilterBody(props: {
  onClose: () => void
  selectedRoomsMin: number
  setSelectedRoomsMin: (newMin: number) => void
}) {
  let classes = useFilterBodyStyles(props)
  return (
    <Paper className={classes.root}>
      <AppTypography
        className={classes.header}
        variant="body1"
        fontWeight="bold">
        Min. rooms
      </AppTypography>
      <AppSliderInput
        value={props.selectedRoomsMin ? props.selectedRoomsMin : 0}
        onChange={props.setSelectedRoomsMin}
        min={10}
        max={300}
      />
      <div className={classes.ctaContainer}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={props.onClose}>
          Done
        </Button>
      </div>
    </Paper>
  )
}

export function HotelGridBudgetFilterBody(props: {
  onClose: () => void
  selected: number
  setSelected: (newVals: number) => void
}) {
  let classes = useFilterBodyStyles(props)
  return (
    <Paper className={classes.root}>
      <AppTypography
        className={classes.header}
        variant="body1"
        fontWeight="bold">
        Budget
      </AppTypography>
      <div className={classes.checkBoxOptionList}>
        <AppSliderInput
          value={props.selected}
          min={0}
          max={5}
          defaultThumb
          onChange={props.setSelected}
        />
      </div>
      <div className={classes.ctaContainer}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={props.onClose}>
          Done
        </Button>
      </div>
    </Paper>
  )
}
