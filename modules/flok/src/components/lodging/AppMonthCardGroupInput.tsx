import {Button, Grid, makeStyles} from "@material-ui/core"
import {CalendarToday} from "@material-ui/icons"
import clsx from "clsx"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    overflowX: "auto",
  },
  cardButton: {
    minWidth: "unset",
    border: `solid 1px ${theme.palette.text.secondary}`,
    color: theme.palette.text.secondary,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    "&:hover": {
      boxShadow: theme.shadows[3],
    },
  },
  cardButtonSelected: {
    boxShadow: theme.shadows[1],
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
  cardButtonText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: (props: AppMonthCardGroupInputProps) =>
      `${
        Math.max(...props.options.map((option) => option.label.trim().length)) +
        0.5
      }ch`,
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(0.5),
    },
  },
}))

type AppMonthCardGroupInputProps = {
  options: {label: string; value: string}[]
  values: string[]
  onChange: (vals: string[]) => void
}

export default function AppMonthCardGroupInput(
  props: AppMonthCardGroupInputProps
) {
  let classes = useStyles(props)

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      wrap="nowrap"
      className={classes.root}>
      {props.options.map((option) => {
        return (
          <Grid item key={option.value}>
            <Button
              className={clsx(
                classes.cardButton,
                props.values.includes(option.value)
                  ? classes.cardButtonSelected
                  : undefined
              )}
              classes={{label: classes.cardButtonText}}
              disableFocusRipple
              disableTouchRipple
              value={option.value}
              onClick={() => {
                if (props.values.includes(option.value)) {
                  props.onChange(
                    props.values.filter((val) => val !== option.value)
                  )
                } else {
                  props.onChange([...props.values, option.value])
                }
              }}>
              <CalendarToday color="inherit" />
              <AppTypography variant="body1">{option.label}</AppTypography>
            </Button>
          </Grid>
        )
      })}
    </Grid>
  )
}
