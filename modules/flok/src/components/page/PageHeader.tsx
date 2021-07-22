import {makeStyles} from "@material-ui/core"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginBottom: theme.spacing(4),

    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(0.5),
    },
  },
  progress: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
}))

export type PageHeaderProps = {
  header: string
  subheader?: string
  progressBar?: JSX.Element
}
export default function PageHeader(props: PageHeaderProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <AppTypography variant="h1" noWrap>
          {props.header}
        </AppTypography>
        <AppTypography variant="body1" noWrap>
          {props.subheader ? props.subheader : <>&nbsp;</>}
        </AppTypography>
      </div>
      {props.progressBar ? (
        <div className={classes.progress}>{props.progressBar}</div>
      ) : undefined}
    </div>
  )
}
