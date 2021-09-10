import {Grid, makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import PageOverlayFooter, {PageOverlayFooterProps} from "./PageOverlayFooter"

let useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    height: "100%",
  },
  overlay: {
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
  },
  overlayBody: {
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "auto",
  },
}))

type PageOverlayProps = PropsWithChildren<{
  OverlayFooterProps?: PageOverlayFooterProps
  size?: "default" | "small"
  right?: JSX.Element
}>
export default function PageOverlay(props: PageOverlayProps) {
  let classes = useStyles(props)
  return (
    <Grid container className={classes.root}>
      <Grid
        item
        xs={11}
        sm={10}
        md={props.size === "small" ? 6 : 9}
        lg={props.size === "small" ? 5 : 7}
        className={classes.overlay}>
        <div className={classes.overlayBody}>{props.children}</div>
        {props.OverlayFooterProps ? (
          <PageOverlayFooter {...props.OverlayFooterProps} />
        ) : undefined}
      </Grid>
      {props.right ? <>{props.right}</> : undefined}
    </Grid>
  )
}