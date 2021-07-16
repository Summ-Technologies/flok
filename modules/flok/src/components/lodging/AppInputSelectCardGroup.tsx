import {Button, makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5),
    maxWidth: "100%",
    display: "flex",
    flexWrap: "nowrap",
    "& > $cardButton:not(:first-child)": {
      marginLeft: theme.spacing(2),
    },
    overflowX: "auto",
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
    <div className={classes.root}>
      {props.options.map((option) => {
        return (
          <Button
            key={option.value}
            className={clsx(
              classes.cardButton,
              props.values.includes(option.value)
                ? classes.cardButtonSelected
                : undefined
            )}
            disableFocusRipple
            disableTouchRipple
            value={option.value}
            onClick={() => props.onChange(option.value)}>
            <AppTypography variant="body1">{option.label}</AppTypography>
          </Button>
        )
      })}
    </div>
  )
}
