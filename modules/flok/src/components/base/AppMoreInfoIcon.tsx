import {makeStyles, Tooltip} from "@material-ui/core"
import {InfoOutlined} from "@material-ui/icons"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    verticalAlign: "text-top",
    color: theme.palette.info.dark,
  },
}))

type AppMoreInfoIconProps = {
  tooltipText: string
}
export default function AppMoreInfoIcon(props: AppMoreInfoIconProps) {
  let classes = useStyles(props)
  return (
    <Tooltip
      placement="top"
      arrow
      title={props.tooltipText}
      className={classes.root}>
      <InfoOutlined fontSize="inherit" />
    </Tooltip>
  )
}
