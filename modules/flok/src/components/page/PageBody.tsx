import {makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    minWidth: 0, // flex box trick to max width 100%
    display: "flex",
    flexDirection: "column",
    paddingLeft: (props: PageBodyProps) =>
      props.noGutter ? 0 : theme.spacing(1),
    paddingRight: (props: PageBodyProps) =>
      props.noGutter ? 0 : theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      paddingLeft: (props: PageBodyProps) =>
        props.noGutter ? 0 : theme.spacing(4),
      paddingRight: (props: PageBodyProps) =>
        props.noGutter ? 0 : theme.spacing(4),
    },
  },
  body: {
    flex: 1,
  },
}))

type PageBodyProps = PropsWithChildren<{
  noGutter?: boolean
}>
export default function PageBody(props: PageBodyProps) {
  const classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.body}>{props.children}</div>
    </div>
  )
}
