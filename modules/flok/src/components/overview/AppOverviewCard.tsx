import {makeStyles, Paper} from "@material-ui/core"
import {SvgIconComponent} from "@material-ui/icons"
import clsx from "clsx"
import React, {PropsWithChildren} from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    width: 250,
    height: 150,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
    "&.error > h3": {
      color: theme.palette.error.main,
    },
    "&.warning > h3": {
      color: theme.palette.warning.main,
    },
    "&.success > h3": {
      color: theme.palette.success.main,
    },
  },
}))

type AppOverviewCardProps = {
  color?: "error" | "warning" | "success"
  label: string
  value?: string
  Icon: SvgIconComponent
}

export default function AppOverviewCard(props: AppOverviewCardProps) {
  let classes = useStyles(props)

  return (
    <Paper variant="outlined" className={clsx(classes.root, props.color)}>
      <props.Icon />
      <AppTypography variant="body1">{props.label}</AppTypography>
      <AppTypography variant="h3">{props.value ?? "--"}</AppTypography>
    </Paper>
  )
}

let useListStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    marginLeft: -theme.spacing(2),
    marginTop: -theme.spacing(2),
    "& > *": {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
  },
}))

export function AppOverviewCardList(props: PropsWithChildren<{}>) {
  let classes = useListStyles()
  return <div className={classes.root}>{props.children}</div>
}
