import {IconButton, makeStyles} from "@material-ui/core"
import {CancelRounded} from "@material-ui/icons"
import {DateRange} from "@material-ui/pickers"
import React, {useState} from "react"
import {DateUtils} from "../../utils"
import AppTypography from "../base/AppTypography"
import AppDateRangePicker from "./AppDateRangePicker"

let useStyles = makeStyles((theme) => ({
  root: {},
  dateRow: {
    paddingLeft: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    "& > .MuiTypography-root:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
    "& > .MuiIconButton-root": {
      marginLeft: theme.spacing(2),
    },
  },
}))

type AppMultiDateRangePickerProps = {
  values: DateRange<Date>[]
  onAdd: (dateRange: DateRange<Date>) => void
  onRemove: (dateRange: DateRange<Date>) => void
}
export default function AppMultiDateRangePicker(
  props: AppMultiDateRangePickerProps
) {
  let classes = useStyles(props)
  let [range, setRange] = useState<[Date?, Date?]>([undefined, undefined])

  let onChangeDateRange = (dateRange: DateRange<Date>) => {
    if (dateRange[0] && dateRange[1]) {
      props.onAdd(dateRange)
      setRange([])
    } else {
      setRange([
        dateRange[0] ? dateRange[0] : undefined,
        dateRange[1] ? dateRange[1] : undefined,
      ])
    }
  }
  return (
    <div className={classes.root}>
      {props.values.map((dR, i) => (
        <div className={classes.dateRow} key={i}>
          <AppTypography fontWeight="bold" variant="body1">
            {dR[0] && DateUtils.getDateString(dR[0])}
            {"  "}&mdash;{"  "}
            {dR[1] && DateUtils.getDateString(dR[1])}
          </AppTypography>
          <IconButton
            onClick={() => {
              props.onRemove(dR)
            }}
            size="small">
            <CancelRounded color="error" />
          </IconButton>
        </div>
      ))}
      <AppDateRangePicker
        numCalendars={2}
        onChange={onChangeDateRange}
        startDate={range[0]}
        endDate={range[1]}
      />
    </div>
  )
}
