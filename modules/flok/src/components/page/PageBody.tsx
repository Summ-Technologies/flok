import {makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import PageHeader, {PageHeaderProps} from "./PageHeader"

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    minWidth: 0, // flex box trick to max width 100%
    display: "flex",
    flexDirection: "column",
  },
  body: {
    flex: 1,
    paddingLeft: (props: PageBodyProps) =>
      props.noGutter ? 0 : theme.spacing(4),
    paddingRight: (props: PageBodyProps) =>
      props.noGutter ? 0 : theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}))

type PageBodyProps = PropsWithChildren<{
  noGutter?: boolean
  HeaderProps?: PageHeaderProps
}>
export default function PageBody(props: PageBodyProps) {
  const classes = useStyles(props)
  return (
    <div className={classes.root}>
      {props.HeaderProps ? <PageHeader {...props.HeaderProps} /> : undefined}
      <div className={classes.body}>{props.children}</div>
    </div>
  )
}
