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
    flexWrap: "nowrap",
  },
}))

type PageContainerProps = {}
export default function PageContainer(
  props: PropsWithChildren<PageContainerProps>
) {
  let height100vh = use100vh()
  const classes = useStyles(props)
  return (
    <Box
      className={classes.root}
      height={height100vh ? height100vh : undefined}>
      {props.children}
    </Box>
  )
}
