import {makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import PageAppBar from "./PageAppBar"

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

type PageBodyProps = PropsWithChildren<{appBar?: boolean}>
export default function PageBody(props: PageBodyProps) {
  const classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.body}>
        {props.appBar && <PageAppBar />}
        {props.children}
      </div>
    </div>
  )
}
