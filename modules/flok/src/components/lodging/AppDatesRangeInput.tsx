import {
  Button,
  ClickAwayListener,
  makeStyles,
  Popper,
  useMediaQuery,
} from "@material-ui/core"
import {CalendarToday} from "@material-ui/icons"
import clsx from "clsx"
import React, {useRef, useState} from "react"
import {DateRange} from "react-date-range"
import "react-date-range/dist/styles.css" // main css file
import "react-date-range/dist/theme/default.css" // theme css file
import {FlokTheme} from "../../theme"
import AppNumberCounterInput from "../base/AppNumberCounterInput"
import AppTypography from "../base/AppTypography"
import AppInputToggle from "./AppInputToggle"
import AppMonthCardGroupInput from "./AppMonthCardGroupInput"

let useStyles = makeStyles((theme) => ({
  rangeBtn: {
    padding: 0,
    border: `solid 1px ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    "& .MuiSvgIcon-root": {
      color: theme.palette.text.secondary,
    },
    "&.active .MuiSvgIcon-root": {
      color: theme.palette.primary.main,
    },
    "&.active": {
      borderColor: theme.palette.primary.main,
    },
  },
  popper: {
    paddingTop: theme.spacing(1),
  },
  dash: {
    height: 25,
    width: 25,
    borderRadius: 20,
  },
  start: {},
  end: {},
  popperBody: {
    padding: theme.spacing(2),
    maxWidth: 690,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 350,
    },
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    alignContent: "stretch",
    "& .MuiSlider-root": {
      marginRight: 25,
      marginLeft: 25,

      [theme.breakpoints.up("sm")]: {
        width: 200,
      },
      [theme.breakpoints.up("lg")]: {
        width: 300,
      },
      width: 150,
    },
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
    "& > * > h4": {
      marginBottom: theme.spacing(0.5),
    },
  },
  calendar: {
    borderRadius: theme.shape.borderRadius,
  },
  exactDatesToggle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  nightsRow: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  monthsSection: {
    width: "100%",
    "& > * > p": {
      marginBottom: theme.spacing(0.25),
      marginTop: theme.spacing(0.5),
    },
  },
}))

type AppRetreatDatesInputProps = {
  isExactDates: boolean
  onChangeIsExactDates: (isExact: boolean) => void

  // exact dates
  onChangeDateRange: (start?: Date, end?: Date) => void
  start?: Date
  end?: Date

  // flexible dates
  numNights: number
  onChangeNumNights: (newVal: number) => void
  preferredMonths: string[]
  onChangePreferredMonths: (vals: string[]) => void
}
export default function AppRetreatDatesInput(props: AppRetreatDatesInputProps) {
  let classes = useStyles(props)
  let [active, setActive] = useState(false)
  let anchorEl = useRef(null)
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setActive(true)
  }
  const closePopper = () => {
    setActive(false)
  }

  // Get values (by year) for flexible month selection
  function getOption(month: number, year: number) {
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    return {
      label: months[month],
      value: `${months[month]}-${year}`,
    }
  }
  let thisYear = new Date().getFullYear()
  let thisMonth = new Date().getMonth()

  return (
    <ClickAwayListener onClickAway={closePopper}>
      <div>
        <Button
          className={clsx(classes.rangeBtn, active ? "active" : undefined)}
          onClick={handleClick}
          ref={anchorEl}>
          <DateInputSummary
            isExactDates={props.isExactDates}
            end={props.end}
            start={props.start}
            preferredMonths={props.preferredMonths}
            numNights={props.numNights}
          />
        </Button>
        <Popper
          className={classes.popper}
          open={active}
          anchorEl={anchorEl.current}
          placement="bottom-end">
          <div className={classes.popperBody}>
            <div className={classes.exactDatesToggle}>
              <AppInputToggle
                trueOption={"Exact"}
                falseOption={"I'm Flexible"}
                value={props.isExactDates}
                onChange={props.onChangeIsExactDates}
              />
            </div>
            {props.isExactDates ? (
              <DateRange
                className={classes.calendar}
                showMonthAndYearPickers={false}
                showDateDisplay={false}
                direction="horizontal"
                months={isSmallScreen ? 1 : 2}
                onChange={(item) =>
                  props.onChangeDateRange(
                    item.selection.startDate,
                    item.selection.endDate
                  )
                }
                ranges={[
                  {
                    startDate: props.start ? props.start : new Date(),
                    endDate: props.end
                      ? props.end
                      : props.start
                      ? props.start
                      : new Date(),
                    key: "selection",
                  },
                ]}
              />
            ) : (
              <>
                <div className={classes.nightsRow}>
                  <AppTypography variant="h4">How many nights?</AppTypography>
                  <AppNumberCounterInput
                    min={1}
                    max={10}
                    value={props.numNights}
                    onChange={props.onChangeNumNights}
                  />
                </div>
                <div className={classes.monthsSection}>
                  <AppTypography variant="h4">What months?</AppTypography>
                  {[thisYear, thisYear + 1].map((year) => {
                    let options =
                      thisYear === year
                        ? [...Array(12 - thisMonth)].map((v, i) =>
                            getOption(i + thisMonth, year)
                          )
                        : [...Array(12)].map((v, i) => getOption(i, year))
                    return (
                      <div>
                        <AppTypography variant="body2" fontWeight="bold">
                          {year}
                        </AppTypography>
                        <AppMonthCardGroupInput
                          values={props.preferredMonths}
                          options={options}
                          onChange={props.onChangePreferredMonths}
                        />
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
  )
}

let useSummaryStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "stretch",
    alignContent: "center",
    "& > *": {
      display: "flex",
      alignItems: "center",
    },
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

function DateInputSummary(props: {
  isExactDates: boolean
  start?: Date
  end?: Date
  preferredMonths: string[]
  numNights?: number
}) {
  let classes = useSummaryStyles(props)
  let dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: undefined,
  }
  return (
    <div className={classes.root}>
      <CalendarToday />
      &nbsp;&nbsp;{" "}
      {props.isExactDates ? (
        <>
          <AppTypography variant="body1">
            {props.start
              ? props.start.toLocaleDateString("en-US", dateOptions)
              : ""}
          </AppTypography>
          <AppTypography>&ndash;</AppTypography>
          <AppTypography>
            {props.end
              ? props.end.toLocaleDateString("en-US", dateOptions)
              : ""}
          </AppTypography>
        </>
      ) : (
        <AppTypography variant="body1">
          {props.numNights ? props.numNights : "__"} night
          {props.numNights !== 1 ? "s" : undefined} in{" "}
          {props.preferredMonths.length > 0
            ? props.preferredMonths
                .map(
                  (val) =>
                    `${val[0].toUpperCase()}${val
                      .substring(1, 3)
                      .toLowerCase()}`
                )
                .slice(0, 3)
                .join(", ")
            : "__"}
          {props.preferredMonths.length > 3 ? "..." : undefined}
        </AppTypography>
      )}
    </div>
  )
}
