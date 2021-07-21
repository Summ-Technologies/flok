import {makeStyles} from "@material-ui/core"
import React from "react"
import AppTypography from "./AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  title: {},
  subheader: {
    marginTop: theme.spacing(0.5),
  },
  cta: {},
}))

type AppHeaderProps = {
  header: JSX.Element | string
  subheader?: JSX.Element | string
  cta?: JSX.Element
}
export default function AppHeader(props: AppHeaderProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div>
        <AppTypography
          className={classes.title}
          variant="h4"
          children={props.header}
        />
        {props.subheader ? (
          <AppTypography
            variant="body1"
            className={classes.subheader}
            children={props.subheader}
          />
        ) : undefined}
      </div>
      {props.cta ? <div className={classes.cta}>{props.cta}</div> : undefined}
    </div>
  )
}
