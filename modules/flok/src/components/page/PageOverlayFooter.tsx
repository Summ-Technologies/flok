import {makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    height: 90,
    width: "100%",
    backgroundColor: theme.palette.grey[50],
    boxShadow: "-2px -2px 1px 1px rgba(0, 0, 0, 0.2)",
    zIndex: theme.zIndex.appBar,
  },

  defaultBody: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
}))

export type PageOverlayFooterProps = PropsWithChildren<{}>
export default function PageOverlayFooter(props: PageOverlayFooterProps) {
  let classes = useStyles(props)
  return <div className={classes.root}>{props.children}</div>
}

export type PageOverlayFooterDefaultBodyProps = PropsWithChildren<{
  rightText?: string
}>
export function PageOverlayFooterDefaultBody(
  props: PageOverlayFooterDefaultBodyProps
) {
  let classes = useStyles(props)
  return (
    <div className={classes.defaultBody}>
      {props.children}
      <AppTypography variant="body1" color="textSecondary">
        {props.rightText || "\u00A0"}
      </AppTypography>
    </div>
  )
}
