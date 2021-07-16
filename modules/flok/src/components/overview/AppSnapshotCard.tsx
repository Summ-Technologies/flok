import {makeStyles, Paper} from "@material-ui/core"
import {SvgIconComponent} from "@material-ui/icons"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
    padding: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  icon: {
    marginBottom: theme.spacing(1),
  },
}))

type AppSnapshotCardProps = {
  Icon: SvgIconComponent
  header: string
  value?: string
  onClick?: () => void
}
export default function AppSnapshotCard(props: AppSnapshotCardProps) {
  let classes = useStyles(props)
  let {Icon, header, value} = {...props}
  return (
    <Paper className={classes.root}>
      <Icon className={classes.icon} fontSize="large" color="inherit" />
      <AppTypography noWrap variant="body1">
        {header}
      </AppTypography>
      <AppTypography noWrap variant="h2">
        {value ? value : "--"}
      </AppTypography>
    </Paper>
  )
}
