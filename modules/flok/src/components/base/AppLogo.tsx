import {makeStyles, StandardProps} from "@material-ui/core"
import clsx from "clsx"
import AppImage from "./AppImage"

const useStyles = makeStyles((theme) => ({
  root: {},
}))

interface AppLogoProps extends StandardProps<{}, "root"> {
  height?: number | string
  withText?: boolean
  noBackground?: boolean
  rounded?: boolean
}

export default function AppLogo(props: AppLogoProps) {
  const classes = useStyles(props)
  const {height, withText, noBackground, rounded, ...extraProps} = props
  const imgKey = withText
    ? noBackground
      ? "logoIconTextTrans"
      : "logoIcon"
    : noBackground
    ? rounded
      ? "logoIconTransRound"
      : "logoIconTrans"
    : rounded
    ? "logoIconRound"
    : "logoIcon"

  return (
    <AppImage
      {...extraProps}
      className={clsx(classes.root, props.className)}
      img={imgKey}
      alt="Flok Logo"
      height={height}
    />
  )
}
