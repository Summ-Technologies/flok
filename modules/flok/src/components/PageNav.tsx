import {AppBar, Toolbar} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import React, {PropsWithChildren} from "react"
import AppLogo from "./AppLogo"

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.mixins.toolbar,
  },
  logo: {
    marginRight: theme.spacing(2),
    height: "50%",
    marginTop: "auto",
    marginBottom: "auto",
  },
  title: {
    flexGrow: 1,
  },
}))

type PageNavProps = {}
export default function PageNav(props: PropsWithChildren<PageNavProps>) {
  const classes = useStyles()
  return (
    <div className={`${classes.root}`}>
      <AppBar variant="outlined" color="transparent" position="fixed">
        <Toolbar>
          <AppLogo className={classes.logo} noBackground withText size="sm" />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  )
}
