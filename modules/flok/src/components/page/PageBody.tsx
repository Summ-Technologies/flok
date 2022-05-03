import {makeStyles} from "@material-ui/core"
import React, {PropsWithChildren, useRef} from "react"
import PageAppBar from "./PageAppBar"
import PageLockedModal from "./PageLockedModal"

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
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
}))

type PageBodyProps = PropsWithChildren<{
  appBar?: boolean
  locked?: boolean
  lockedText?: string
}>
export default function PageBody(props: PageBodyProps) {
  const classes = useStyles(props)
  const bodyRef = useRef<HTMLDivElement>(null)
  return (
    <div className={classes.root}>
      <div className={classes.body} ref={bodyRef}>
        {props.locked && (
          <PageLockedModal
            pageDesc={props.lockedText}
            container={bodyRef.current ?? undefined}
          />
        )}
        {props.appBar && <PageAppBar />}
        {props.children}
      </div>
    </div>
  )
}
