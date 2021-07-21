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

type AppDateRangePickerProps = {}
export default function AppDateRangePicker(props: AppDateRangePickerProps) {
  let classes = useStyles(props)
  const [value, setValue] = React.useState<DateRange<Date>>([null, null])
  return (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <StaticDateRangePicker
        className={classes.root}
        displayStaticWrapperAs="desktop"
        calendars={2}
        disablePast
        value={value}
        onChange={(date) => setValue(date)}
        renderInput={(startProps, endProps) => <></>}
      />
    </LocalizationProvider>
  )
}
