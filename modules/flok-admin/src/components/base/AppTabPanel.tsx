import {makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React, {PropsWithChildren} from "react"

let useStyles = makeStyles((theme) => ({
  hide: {
    display: "none",
  },
}))

type AppTabPanelProps = PropsWithChildren<{show?: boolean; className?: string}>
/**
 * Display none
 * @param props
 * @returns
 */
export default function AppTabPanel(props: AppTabPanelProps) {
  let classes = useStyles(props)
  return (
    <div
      className={clsx(props.show ? undefined : classes.hide, props.className)}>
      {props.children}
    </div>
  )
}
