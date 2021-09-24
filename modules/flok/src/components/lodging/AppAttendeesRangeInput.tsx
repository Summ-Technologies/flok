import {
  Button,
  ClickAwayListener,
  makeStyles,
  TextField,
} from "@material-ui/core"
import {People} from "@material-ui/icons"
import clsx from "clsx"
import React, {useRef, useState} from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  rangeBtn: {
    padding: 0,
    border: `solid 1px ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    "& .MuiSvgIcon-root": {
      color: (props: AppAttendeesRangeInputProps) =>
        props.error ? theme.palette.error.main : theme.palette.text.secondary,
    },
    "&.active .MuiSvgIcon-root": {
      color: (props: AppAttendeesRangeInputProps) =>
        props.error ? theme.palette.error.main : theme.palette.primary.main,
    },
    "&.active": {
      borderColor: (props: AppAttendeesRangeInputProps) =>
        props.error ? theme.palette.error.main : theme.palette.primary.main,
    },
    borderColor: (props: AppAttendeesRangeInputProps) =>
      props.error ? theme.palette.error.main : theme.palette.grey[400],
  },
  popper: {
    paddingTop: theme.spacing(1),
  },
  dash: {
    height: 25,
    width: 25,
    borderRadius: 20,
  },
  lower: {},
  upper: {},
}))

type AppAttendeesRangeInputProps = {
  onChange: (lower?: number, upper?: number) => void
  lower?: number
  upper?: number
  error?: boolean
}
export default function AppAttendeesRangeInput(
  props: AppAttendeesRangeInputProps
) {
  let classes = useStyles(props)
  let [active, setActive] = useState(false)
  let anchorEl = useRef(null)
  let {lower, upper} = {...props}

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setActive(true)
  }
  const closePopper = () => {
    setActive(false)
  }

  return (
    <ClickAwayListener onClickAway={closePopper}>
      <div>
        <Button
          className={clsx(classes.rangeBtn, active ? "active" : undefined)}
          onClick={handleClick}
          ref={anchorEl}>
          <Range
            active={active}
            upper={upper}
            lower={lower}
            onChange={props.onChange}
          />
        </Button>
      </div>
    </ClickAwayListener>
  )
}

let useRangeStyles = makeStyles((theme) => ({
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
    "& > $upper, & > $lower": {
      width: "5ch",
    },
    "& .MuiInput-input": {},
  },
  dash: {
    height: 25,
    width: 25,
  },
  lower: {},
  upper: {},
}))

function Range(props: {
  active?: boolean
  lower?: number
  upper?: number
  onChange: (lower?: number, upper?: number) => void
}) {
  let classes = useRangeStyles(props)
  let {upper, lower, onChange, active} = {...props}
  let [lowerDefault, upperDefault] = [25, 30]
  return (
    <div className={classes.root}>
      <People />
      &nbsp;&nbsp;{" "}
      <AppTypography variant="body1" className={classes.lower}>
        {active ? (
          <TextField
            autoFocus
            fullWidth
            value={lower}
            onChange={(e) => {
              props.onChange(parseInt(e.target.value), upper)
            }}
            size="small"
            type="number"
            placeholder={lowerDefault.toString()}
          />
        ) : lower ? (
          lower
        ) : (
          lowerDefault
        )}
      </AppTypography>
      <AppTypography className={classes.dash}>&ndash;</AppTypography>
      <AppTypography className={classes.upper}>
        {active ? (
          <TextField
            fullWidth
            value={upper}
            onChange={(e) => {
              onChange(lower, parseInt(e.target.value))
            }}
            size="small"
            type="number"
            placeholder={upperDefault.toString()}
          />
        ) : upper ? (
          upper
        ) : (
          upperDefault
        )}
      </AppTypography>
    </div>
  )
}
