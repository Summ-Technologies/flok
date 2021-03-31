import {AppBar, Box, Toolbar, Typography} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import React, {PropsWithChildren} from "react"
import {useSelector} from "react-redux"
import CompanyGetters from "../store/getters/company"
import UserGetters from "../store/getters/user"
import AppLogo from "./AppLogo"

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.mixins.toolbar,
  },
  logo: {
    marginRight: theme.spacing(2),
    height: "50%",
    display: "flex",
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}))

type PageNavProps = {}
export default function PageNav(props: PropsWithChildren<PageNavProps>) {
  const classes = useStyles()
  let userEmail = useSelector(UserGetters.getUserEmail)
  let userCompany = useSelector(CompanyGetters.getCompany)
  return (
    <AppBar
      variant="outlined"
      color="inherit"
      position="fixed"
      className={`${classes.root}`}>
      <Toolbar>
        <AppLogo className={classes.logo} noBackground withText height={40} />
        {userEmail ? (
          <Typography variant="body1">
            <Box component="span" lineHeight="1.1rem">
              {userCompany && userCompany.name ? (
                <Box component="span" fontWeight="fontWeightMedium">
                  {userCompany.name}
                  <br />
                </Box>
              ) : undefined}
              {userEmail}
            </Box>
          </Typography>
        ) : undefined}
      </Toolbar>
    </AppBar>
  )
}
