import {ButtonBase, makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& $card:not(:first-child)": {
      marginLeft: theme.spacing(2),
    },
  },
  card: {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: "100%",
    border: `solid 1px ${theme.palette.grey[300]}`,
    "&.active": {
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      borderWidth: 2,
      backgroundColor: theme.palette.common.white,
    },
    backgroundColor: theme.palette.grey[100],
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    textAlign: "center",
    flexDirection: "column",
    "&:hover": {
      boxShadow: theme.shadows[1],
    },
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(0.5),
    },
    "& > .MuiTypography-root": {
      width: "100%",
    },
  },
}))

type BudgetType = "$" | "$$" | "$$$" | "$$$$"

type AppBudgetInputProps = {
  value: BudgetType[]
  onChange: (newVal: BudgetType[]) => void
}
export default function AppBudgetInput(props: AppBudgetInputProps) {
  let classes = useStyles(props)
  function onSelect(clicked: BudgetType) {
    if (props.value.includes(clicked)) {
      props.onChange(props.value.filter((val) => val !== clicked))
    } else {
      props.onChange([...props.value, clicked])
    }
  }
  return (
    <div className={classes.root}>
      <ButtonBase
        className={clsx(classes.card, props.value.includes("$") && "active")}
        onClick={() => onSelect("$")}
        disableTouchRipple
        disableRipple>
        <AppTypography variant="h3">$</AppTypography>
      </ButtonBase>
      <ButtonBase
        className={clsx(classes.card, props.value.includes("$$") && "active")}
        onClick={() => onSelect("$$")}
        disableTouchRipple
        disableRipple>
        <AppTypography variant="h3">$$</AppTypography>
      </ButtonBase>
      <ButtonBase
        className={clsx(classes.card, props.value.includes("$$$") && "active")}
        onClick={() => onSelect("$$$")}
        disableTouchRipple
        disableRipple>
        <AppTypography variant="h3">$$$</AppTypography>
      </ButtonBase>
      <ButtonBase
        className={clsx(classes.card, props.value.includes("$$$$") && "active")}
        onClick={() => onSelect("$$$$")}
        disableTouchRipple
        disableRipple>
        <AppTypography variant="h3">$$$$</AppTypography>
      </ButtonBase>
    </div>
  )
}
