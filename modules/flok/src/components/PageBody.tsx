import {Grid, makeStyles, Theme} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import {use100vh} from "react-div-100vh"
import PageNav from "./PageNav"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
  },
  body: {
    marginLeft: "auto",
    marginRight: "auto",
    flexGrow: 1,
  },
}))

type PageBodyProps = {
  hideNav?: boolean
}
export default function PageBody(props: PropsWithChildren<PageBodyProps>) {
  let height100vh = use100vh()
  const classes = useStyles()
  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      className={classes.root}
      style={height100vh ? {height: height100vh} : undefined}>
      {props.hideNav ? undefined : (
        <Grid item>
          <PageNav />
        </Grid>
      )}
      <Grid item md={10} className={classes.body}>
        {props.children}
      </Grid>
    </Grid>
  )
}
