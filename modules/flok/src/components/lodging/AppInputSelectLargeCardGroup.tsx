import {Button, makeStyles} from "@material-ui/core"
import {CheckRounded} from "@material-ui/icons"
import clsx from "clsx"
import React from "react"
import AppAvatar from "../base/AppAvatar"
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
    backgroundColor: "unset",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    "&:hover": {
      boxShadow: theme.shadows[3],
      backgroundColor: "unset",
    },
  },
  cardButtonSelected: {
    backgroundColor: "unset",
    boxShadow: theme.shadows[1],
    borderColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: "unset",
    },
  },
  cardButtonBody: {
    display: "flex",
    flexDirection: "row",
  },
  cardButtonBodyText: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    "& > p": {
      lineHeight: "1.43em",
      height: `${1.43 * 3}em`,
      overflow: "hidden",
    },
  },
  cardButtonBodyIcon: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
}))

type AppInputSelectLargeCardGroupProps = {
  options: {label: string; value: string; description: string}[]
  values: string[]
  onChange: (val: string) => void
}

export default function AppInputSelectLargeCardGroup(
  props: AppInputSelectLargeCardGroupProps
) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      {props.options.map((option) => {
        let selected = props.values.includes(option.value)
        return (
          <Button
            key={option.value}
            className={clsx(
              classes.cardButton,
              selected ? classes.cardButtonSelected : undefined
            )}
            variant="outlined"
            disableFocusRipple
            disableTouchRipple
            value={option.value}
            onClick={() => props.onChange(option.value)}>
            <div className={classes.cardButtonBody}>
              <div className={classes.cardButtonBodyText}>
                <AppTypography variant="h5">{option.label}</AppTypography>
                <AppTypography variant="body2">
                  {option.description}
                </AppTypography>
              </div>
              <div className={classes.cardButtonBodyIcon}>
                <AppAvatar
                  color={selected ? "primary" : undefined}
                  borderColor={selected ? "primary" : "grey"}>
                  {selected ? <CheckRounded /> : undefined}
                </AppAvatar>
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
