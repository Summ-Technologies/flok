import {Button, Grid, makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
  },
  cardButton: {
    minWidth: "unset",
    backgroundColor: theme.palette.grey[200],
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    "&:hover": {
      boxShadow: theme.shadows[3],
      backgroundColor: theme.palette.grey[200],
    },
  },
  cardButtonSelected: {
    backgroundColor: theme.palette.primary.light,
    boxShadow: theme.shadows[1],
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  cardButtonText: {
    width: (props: AppInputSelectCardGroupProps) =>
      `${
        Math.max(...props.options.map((option) => option.label.trim().length)) +
        0.5
      }ch`,
  },
}))

type AppInputSelectCardGroupProps = {
  options: {label: string; value: string}[]
  values: string[]
  onChange: (val: string) => void
}

export default function AppInputSelectCardGroup(
  props: AppInputSelectCardGroupProps
) {
  let classes = useStyles(props)

  return (
    <Grid container spacing={2} direction="row" className={classes.root}>
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
              onClick={() => props.onChange(option.value)}>
              <AppTypography variant="body1">{option.label}</AppTypography>
            </Button>
          </Grid>
        )
      })}
    </Grid>
  )
}
