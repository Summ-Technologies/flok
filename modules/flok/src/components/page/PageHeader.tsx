import {Button, makeStyles} from "@material-ui/core"
import {KeyboardBackspace} from "@material-ui/icons"
import React from "react"
import {Link} from "react-router-dom"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing(3),
  },
  backBtn: {
    marginBottom: theme.spacing(2),
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
  goBackTo?: string
}
export default function PageHeader(props: PageHeaderProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      {props.goBackTo ? (
        <Button
          className={classes.backBtn}
          component={Link}
          variant="outlined"
          color="primary"
          size="small"
          to={props.goBackTo}>
          <KeyboardBackspace />
          {"\u00A0"}
          Back
          {"\u00A0"}
        </Button>
      ) : undefined}
      <div className={classes.title}>
        <AppTypography variant="h1" noWrap>
          {props.header}
        </AppTypography>
        {props.subheader ? (
          <AppTypography variant="body1">{props.subheader}</AppTypography>
        ) : undefined}
      </div>
    </div>
  )
}
