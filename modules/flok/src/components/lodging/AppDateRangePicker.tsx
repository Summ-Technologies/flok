import {makeStyles} from "@material-ui/core"
import {
  DateRange,
  LocalizationProvider,
  StaticDateRangePicker,
} from "@material-ui/pickers"
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiPickersDesktopDateRangeCalendar-rangeCalendarContainer": {
      borderRight: "unset",
    },
    "& .MuiPickersDay-root": {
      borderRadius: theme.shape.borderRadius,
    },
    "& .MuiPickersDateRangeDay-rangeIntervalDayPreview.MuiPickersDateRangeDay-rangeIntervalDayPreviewEnd":
      {
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
      },
    "& .MuiPickersDateRangeDay-rangeIntervalDayPreview.MuiPickersDateRangeDay-rangeIntervalDayPreviewStart":
      {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderBottomLeftRadius: theme.shape.borderRadius,
      },
    "& .MuiPickersDateRangeDay-rangeIntervalDayHighlightEnd": {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
    "& .MuiPickersDateRangeDay-rangeIntervalDayHighlightStart": {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    "& .MuiPickersDateRangeDay-rangeIntervalDayHighlight:last-child": {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
    "& .MuiPickersDateRangeDay-rangeIntervalDayHighlight:first-child": {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    "& .MuiPickersDateRangeDay-root:first-child .MuiPickersDateRangeDay-rangeIntervalDayPreview":
      {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderBottomLeftRadius: theme.shape.borderRadius,
      },
    "& .MuiPickersDateRangeDay-root:last-child .MuiPickersDateRangeDay-rangeIntervalDayPreview":
      {
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
      },
  },
}))

type AppDateRangePickerProps = {
  startDate?: Date
  endDate?: Date
  onChange: (dateRange: DateRange<Date>) => void
  numCalendars?: 2 | 1 | 3 | undefined
}
export default function AppDateRangePicker(props: AppDateRangePickerProps) {
  let classes = useStyles(props)
  return (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <StaticDateRangePicker
        showToolbar={false}
        className={classes.root}
        displayStaticWrapperAs="desktop"
        calendars={props.numCalendars ? props.numCalendars : 1}
        disablePast
        value={[props.startDate, props.endDate]}
        onChange={props.onChange}
        renderInput={(startProps, endProps) => <></>}
      />
    </LocalizationProvider>
  )
}
