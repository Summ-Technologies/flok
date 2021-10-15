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
      color: (props: AppAttendeesInputProps) =>
        props.error ? theme.palette.error.main : theme.palette.text.secondary,
    },
    "&.active .MuiSvgIcon-root": {
      color: (props: AppAttendeesInputProps) =>
        props.error ? theme.palette.error.main : theme.palette.primary.main,
    },
    "&.active": {
      borderColor: (props: AppAttendeesInputProps) =>
        props.error ? theme.palette.error.main : theme.palette.primary.main,
    },
    borderColor: (props: AppAttendeesInputProps) =>
      props.error ? theme.palette.error.main : theme.palette.grey[400],
  },
  numAttendees: {
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

type AppAttendeesInputProps = {
  onChange: (attendees?: number) => void
  numAttendees?: number
  error?: boolean
}
export default function AppAttendeesInput(props: AppAttendeesInputProps) {
  let classes = useStyles(props)
  let [active, setActive] = useState(false)
  let anchorEl = useRef(null)
  let numAttendeesDefault = 25

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
          <div className={classes.numAttendees}>
            <People />
            &nbsp;&nbsp;{" "}
            <AppTypography variant="body1" className={classes.lower}>
              {active ? (
                <TextField
                  autoFocus
                  fullWidth
                  value={props.numAttendees}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      props.onChange(undefined)
                    }
                    let newVal = parseInt(e.target.value)
                    if (!isNaN(newVal)) {
                      props.onChange(newVal)
                    }
                  }}
                  size="small"
                  type="number"
                  placeholder={numAttendeesDefault.toString()}
                />
              ) : props.numAttendees ? (
                props.numAttendees
              ) : (
                numAttendeesDefault
              )}
            </AppTypography>
          </div>
        </Button>
      </div>
    </ClickAwayListener>
  )
}
