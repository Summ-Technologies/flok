import {AppBar, Box, Paper, Toolbar, Typography} from "@material-ui/core"
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
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}))

type PageNavProps = {
  userEmail?: string
  userCompany?: string
}
export default function PageNav(props: PropsWithChildren<PageNavProps>) {
  const classes = useStyles()
  return (
    <Paper elevation={2} className={`${classes.root}`}>
      <AppBar variant="outlined" color="inherit" position="fixed">
        <Toolbar>
          <AppLogo className={classes.logo} noBackground withText size="sm" />
          {props.userEmail ? (
            <Typography variant="body1">
              <Box lineHeight="1.1rem">
                {props.userCompany ? (
                  <Box fontWeight="fontWeightMedium">{props.userCompany}</Box>
                ) : undefined}
                {props.userEmail}
              </Box>
            </Typography>
          ) : undefined}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Paper>
  )
}
