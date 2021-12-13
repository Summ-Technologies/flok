import {Button, Chip, Hidden, makeStyles} from "@material-ui/core"
import {KeyboardBackspace} from "@material-ui/icons"
import React from "react"
import {RetreatModel} from "../../models/retreat"
import AppTypography from "../base/AppTypography"
import RetreatAccountHeader from "../lodging/RetreatAccountHeader"

let useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing(3),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  preHeader: {
    marginBottom: theme.spacing(1),
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
  postHeader: {marginTop: theme.spacing(1)},
}))

export type PageHeaderProps = {
  header: JSX.Element | string
  subheader?: string
  preHeader?: JSX.Element
  postHeader?: JSX.Element
  retreat?: RetreatModel
}
export default function PageHeader(props: PageHeaderProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div>
        {props.preHeader ? (
          <div className={classes.preHeader}>{props.preHeader}</div>
        ) : undefined}

        <div className={classes.title}>
          {typeof props.header === "string" ? (
            <AppTypography variant="h1" noWrap>
              {props.header}
            </AppTypography>
          ) : (
            props.header
          )}
          {props.subheader ? (
            <AppTypography variant="body1">{props.subheader}</AppTypography>
          ) : undefined}
        </div>
        {props.postHeader ? (
          <div className={classes.postHeader}>{props.postHeader}</div>
        ) : undefined}
      </div>
      {props.retreat && (
        <Hidden smDown>
          <RetreatAccountHeader retreat={props.retreat} />
        </Hidden>
      )}
    </div>
  )
}

let useBackButtonStyles = makeStyles((theme) => ({
  label: {
    fontWeight: theme.typography.fontWeightBold,
  },
}))

export function PageHeaderBackButton(props: {onClick: () => void}) {
  let classes = useBackButtonStyles(props)
  return (
    <Chip
      classes={{label: classes.label}}
      label="Back"
      icon={<KeyboardBackspace />}
      component={Button}
      variant="outlined"
      color="primary"
      onClick={props.onClick}
      clickable
    />
  )
}
