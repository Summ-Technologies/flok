import {Box, makeStyles, Theme} from "@material-ui/core"
import clsx from "clsx"
import React, {PropsWithChildren} from "react"
import {use100vh} from "react-div-100vh"

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    maxWidth: "100vw",
    display: "flex",
    flexWrap: "nowrap",
  },
  backgroundImage: {
    backgroundImage: (props: PageContainerProps) =>
      `url("${props.backgroundImage}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
}))

type PageContainerProps = {
  backgroundImage?: string
}
export default function PageContainer(
  props: PropsWithChildren<PageContainerProps>
) {
  let height100vh = use100vh()
  const classes = useStyles(props)
  return (
    <Box
      className={clsx(
        classes.root,
        props.backgroundImage ? classes.backgroundImage : undefined
      )}
      maxHeight={height100vh ? height100vh : "100vh"}
      height={height100vh ? height100vh : "100vh"}>
      {props.children}
    </Box>
  )
}
