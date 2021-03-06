import {Grid, Hidden, makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import PageOverlayFooter from "./PageOverlayFooter"

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
  },
  overlayBody: {
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      paddingBottom: theme.spacing(1),
    },
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "auto",
  },
  right: {
    height: "100%",
    flex: 1,
    overflow: "auto",
  },
}))

type PageOverlayProps = PropsWithChildren<{
  footerBody?: JSX.Element
  size?: "default" | "small"
  right?: JSX.Element
}>
export default function PageOverlay(props: PageOverlayProps) {
  let classes = useStyles(props)
  return (
    <Grid container className={classes.root}>
      <Grid
        item
        xs={12}
        sm={12}
        md={props.right ? (props.size === "small" ? 6 : 9) : undefined}
        lg={props.right ? (props.size === "small" ? 5 : 7) : undefined}
        className={classes.overlay}>
        <div className={classes.overlayBody}>{props.children}</div>
        {props.footerBody ? (
          <PageOverlayFooter>{props.footerBody}</PageOverlayFooter>
        ) : undefined}
      </Grid>
      {props.right ? (
        <Hidden smDown={true}>
          <div className={classes.right}>{props.right}</div>
        </Hidden>
      ) : undefined}
    </Grid>
  )
}
