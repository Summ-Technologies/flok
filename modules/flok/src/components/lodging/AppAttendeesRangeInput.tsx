import {
  Button,
  ClickAwayListener,
  makeStyles,
  Popper,
  TextField,
} from "@material-ui/core"
import {People} from "@material-ui/icons"
import clsx from "clsx"
import React, {useRef, useState} from "react"
import {AppSliderRangeInput} from "../base/AppSliderInputs"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  active: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    "& .MuiSvgIcon-root": {
      color: theme.palette.primary.main,
    },
  },
  inactive: {
    padding: 0,
    border: `solid 1px ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    "& .MuiSvgIcon-root": {
      color: theme.palette.text.secondary,
    },
  },
  range: {
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
    borderRadius: 20,
  },
  lower: {},
  upper: {},
  popperBody: {
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
  },
  none: {opacity: "0"},
}))

type AppAttendeesRangeInputProps = {
  onChange: (lower?: number, upper?: number) => void
  lower?: number
  upper?: number
}
export default function AppAttendeesRangeInput(
  props: AppAttendeesRangeInputProps
) {
  let classes = useStyles(props)
  let [active, setActive] = useState(false)
  let anchorEl = useRef(null)
  let lower = props.lower ? props.lower : 25
  let upper = props.upper ? props.upper : 30

  const handleSliderChange = (val: [number, number]) => {
    props.onChange(val[0], val[1])
  }
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setActive(true)
  }
  const closePopper = () => {
    setActive(false)
  }

  return (
    <>
      <div ref={anchorEl}></div>
      <Button
        className={clsx(classes.inactive, active ? classes.none : undefined)}
        onClick={handleClick}>
        <Range
          active={active}
          upper={upper}
          lower={lower}
          onChange={props.onChange}
          classes={classes}
        />
      </Button>
      <Popper
        className={classes.active}
        open={active}
        anchorEl={anchorEl.current}
        placement="bottom-end">
        <ClickAwayListener onClickAway={closePopper}>
          <div className={classes.popperBody}>
            <Range
              active={active}
              upper={upper}
              lower={lower}
              onChange={props.onChange}
              classes={classes}
            />
            <AppSliderRangeInput
              value={[lower, upper]}
              onChange={handleSliderChange}
              min={10}
              max={250}
            />
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  )
}

function Range(props: {
  classes: {range: string; upper: string; lower: string; dash: string}
  active?: boolean
  lower: number
  upper: number
  onChange: (lower?: number, upper?: number) => void
}) {
  let {classes, upper, lower, onChange, active} = {...props}
  return (
    <div className={classes.range}>
      <People />
      &nbsp;&nbsp;{" "}
      <AppTypography variant="body1" className={classes.lower}>
        {active ? (
          <TextField
            fullWidth
            value={lower}
            onChange={(e) => {
              if (parseInt(e.target.value) <= upper) {
                props.onChange(parseInt(e.target.value), upper)
              }
            }}
            size="small"
            type="number"
          />
        ) : (
          lower
        )}
      </AppTypography>
      <AppTypography className={classes.dash}>&ndash;</AppTypography>
      <AppTypography className={classes.upper}>
        {active ? (
          <TextField
            fullWidth
            value={upper}
            onChange={(e) => {
              if (lower <= parseInt(e.target.value)) {
                onChange(lower, parseInt(e.target.value))
              }
            }}
            size="small"
            type="number"
          />
        ) : (
          upper
        )}
      </AppTypography>
    </div>
  )
}
