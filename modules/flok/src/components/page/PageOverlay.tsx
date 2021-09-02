import {Grid, makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    height: "100%",
  },
  overlay: {
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },
}))

type PageOverlayProps = PropsWithChildren<{}>
export default function PageOverlay(props: PageOverlayProps) {
  let classes = useStyles(props)
  return (
    <Grid container className={classes.root}>
      <Grid item xs={11} sm={10} md={9} lg={7} className={classes.overlay}>
        {props.children}
      </Grid>
    </Grid>
  )
}
