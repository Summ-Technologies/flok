import {makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    minWidth: 0, // flex box trick to max width 100%
    display: "flex",
    flexDirection: "column",
  },
  body: {
    flex: 1,
    overflow: "auto",
  },
}))

type PageBodyProps = PropsWithChildren<{}>
export default function PageBody(props: PageBodyProps) {
  const classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.body}>{props.children}</div>
    </div>
  )
}
