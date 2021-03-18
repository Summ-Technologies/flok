import {Grid, makeStyles, Theme} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import {use100vh} from "react-div-100vh"
import {useSelector} from "react-redux"
import UserGetters from "../store/getters/user"
import PageNav from "./PageNav"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
  },
  body: {
    width: "100%",
    minHeight: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
}))

type PageBodyProps = {
  hideNav?: boolean
}
export default function PageBody(props: PropsWithChildren<PageBodyProps>) {
  let height100vh = use100vh()
  let userEmail = useSelector(UserGetters.getUserEmail)
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
          <PageNav userEmail={userEmail} userCompany={"Flok"} />
        </Grid>
      )}
      <Grid item md={10} className={classes.body}>
        {props.children}
      </Grid>
    </Grid>
  )
}
