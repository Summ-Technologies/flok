import {Box, makeStyles, StandardProps} from "@material-ui/core"
import clsx from "clsx"
import {ImageUtils} from "../utils/imageUtils"

const useStyles = makeStyles((theme) => ({
  root: {
    height: (props: AppLogoProps) => (props.height ? props.height : "100%"),
  },
  img: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
}))

interface AppLogoProps extends StandardProps<{}, "img"> {
  height?: number | string
  size?: "sm" | "md" | "lg" | "xl"
  withText?: boolean
  noBackground?: boolean
  rounded?: boolean
}

export default function AppLogo(props: AppLogoProps) {
  const classes = useStyles(props)
  const {height, size, withText, noBackground, rounded, ...extraProps} = props
  const path = `branding/logos/${props.withText ? "icon_text" : "icon"}-${
    noBackground ? "empty_bg" : "white_bg"
  }${!withText && rounded ? "-rounded" : ""}`
  const imgProps = ImageUtils.getImageProps(path, "Flok Logo", size)
  return (
    <Box {...extraProps} className={clsx(classes.root, props.className)}>
      <img src={imgProps.src} alt={imgProps.alt} className={classes.img} />
    </Box>
  )
}
