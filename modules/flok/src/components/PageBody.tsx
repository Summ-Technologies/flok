import {Grid, makeStyles, Theme} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import {use100vh} from "react-div-100vh"
import PageNav from "./PageNav"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: (props) =>
      props.hideNav ? undefined : theme.mixins.toolbar.height,
  },
  body: {
    width: "100%",
    minHeight: "100%",
    marginLeft: "auto",
    marginRight: "auto",

    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    paddingLeft: (props: PageBodyProps) =>
      props.fullWidth ? theme.spacing(1) : undefined,
    paddingRight: (props: PageBodyProps) =>
      props.fullWidth ? theme.spacing(1) : undefined,
  },
}))

type PageBodyProps = {
  hideNav?: boolean
  fullWidth?: boolean
}
export default function PageBody(props: PropsWithChildren<PageBodyProps>) {
  let height100vh = use100vh()
  const classes = useStyles(props)
  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      className={classes.root}
      spacing={0}
      style={height100vh ? {height: height100vh} : undefined}>
      {props.hideNav ? undefined : (
        <Grid item>
          <PageNav />
        </Grid>
      )}
      <Grid item md={props.fullWidth ? 12 : 10} className={classes.body}>
        {props.children}
      </Grid>
    </Grid>
  )
}
