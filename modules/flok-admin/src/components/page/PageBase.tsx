import {Box, makeStyles, Theme} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import {use100vh} from "react-div-100vh"
import PageNav from "./PageNav"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    maxWidth: "100vw",
    display: "flex",
    flexWrap: "nowrap",
  },
  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
}))

type PageBaseProps = {}
export default function PageBase(props: PropsWithChildren<PageBaseProps>) {
  let height100vh = use100vh()
  const classes = useStyles(props)
  return (
    <Box
      className={classes.root}
      maxHeight={height100vh ? height100vh : "100vh"}
      height={height100vh ? height100vh : "100vh"}>
      <div className={classes.main}>
        <PageNav />
        {props.children}
      </div>
    </Box>
  )
}
