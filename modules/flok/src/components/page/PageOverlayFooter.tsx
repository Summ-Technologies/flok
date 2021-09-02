import {makeStyles} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 90,
    width: "100%",
    backgroundColor: theme.palette.grey[50],
    boxShadow: "-2px -2px 1px 1px rgba(0, 0, 0, 0.2)",
    zIndex: theme.zIndex.appBar,
  },
  cta: {
    [theme.breakpoints.up("md")]: {
      minWidth: 160,
    },
  },
}))

export type PageOverlayFooterProps = {
  cta: string
  onClick: () => void
  ctaDisabled?: boolean
  rightText?: string
}
export default function PageOverlayFooter(props: PageOverlayFooterProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <Button
        disabled={props.ctaDisabled}
        size="large"
        variant="contained"
        color="primary"
        onClick={props.onClick}
        className={classes.cta}>
        {props.cta}
      </Button>
      <AppTypography variant="body1" color="textSecondary">
        {props.rightText}
      </AppTypography>
    </div>
  )
}
