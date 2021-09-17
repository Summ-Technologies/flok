import {
  Button,
  Checkbox,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core"
import {useEffect, useRef} from "react"
import {InfiniteHitsProvided} from "react-instantsearch-core"
import {connectInfiniteHits} from "react-instantsearch-dom"
import {BudgetType, HotelModel} from "../../models/lodging"
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

interface HotelGridProps extends InfiniteHitsProvided<HotelModel> {
  isSelected: (hit: HotelModel) => boolean
  onSelect: (hit: HotelModel) => void
  onExplore: (hit: HotelModel) => void
}

function HotelGrid(props: HotelGridProps) {
  let classes = useStyles(props)
  const {hasMore, refineNext} = props
  let sentinelRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    function loadMoreHits(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore) {
          refineNext()
        }
      })
    }
    let observer = new IntersectionObserver(loadMoreHits)
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }
    return () => observer.disconnect()
  }, [hasMore, refineNext])

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
          name={hit.name}
          rooms={100}
          stars={4}
          key={index}
          onExplore={() => props.onExplore(hit)}
          onSelect={() => props.onSelect(hit)}
          selected={props.isSelected(hit)}
        />
      ))}
      <li ref={sentinelRef} />
    </div>
  )
}

export default connectInfiniteHits<HotelGridProps, HotelModel>(HotelGrid)

const useFilterStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
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
  onClose: () => void
  selected: string[]
  setSelected: (value: string[]) => void
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
        {["1", "2", "3", "4", "5", "6", "7", "8"].map((curr) => (
          <div className={classes.checkBoxOption}>
            <Checkbox
              color="primary"
              checked={props.selected.includes(curr)}
              onChange={() => {
                if (props.selected.includes(curr)) {
                  props.setSelected(
                    props.selected.filter((val) => val !== curr)
                  )
                } else {
                  props.setSelected([...props.selected, curr])
                }
              }}
            />
            <ListItemText primary={curr} />
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
  selected: BudgetType[]
  setSelected: (newVals: BudgetType[]) => void
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
        {(["$", "$$", "$$$", "$$$$"] as BudgetType[]).map(
          (curr: BudgetType) => {
            return (
              <div className={classes.checkBoxOption}>
                <Checkbox
                  color="primary"
                  checked={props.selected.includes(curr)}
                  onChange={() => {
                    if (props.selected.includes(curr)) {
                      props.setSelected(
                        props.selected.filter((val) => val !== curr)
                      )
                    } else {
                      props.setSelected([...props.selected, curr])
                    }
                  }}
                />
                <ListItemText primary={curr} />
              </div>
            )
          }
        )}
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
