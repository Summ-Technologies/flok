import {Box, makeStyles, Theme} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import {use100vh} from "react-div-100vh"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    maxWidth: "100vw",
    height: "100vh",
    maxHeight: "100vh",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      paddingTop: (props) =>
        props.sideNav ? theme.mixins.toolbar.height : undefined,
    },
  },
  body: {
    width: "100%",
    height: "100%",
    maxHeight: "100%",
    marginLeft: "auto",
    marginRight: "auto",

    overflow: "auto",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: (props: PageBodyProps) =>
        props.fullWidth ? undefined : theme.spacing(1),
      paddingRight: (props: PageBodyProps) =>
        props.fullWidth ? undefined : theme.spacing(1),
    },
    paddingLeft: (props: PageBodyProps) =>
      props.fullWidth ? undefined : theme.spacing(8),
    paddingRight: (props: PageBodyProps) =>
      props.fullWidth ? undefined : theme.spacing(8),
  },
}))

type PageBodyProps = {
  sideNav?: JSX.Element
  fullWidth?: boolean
}
export default function PageBody(props: PropsWithChildren<PageBodyProps>) {
  let height100vh = use100vh()
  const classes = useStyles(props)
  return (
    <Box
      className={classes.root}
      height={height100vh ? height100vh : undefined}>
      {props.sideNav ? <>{props.sideNav}</> : undefined}
      <Box className={classes.body}>{props.children}</Box>
    </Box>
  )
}
