import {Box, makeStyles, PaperProps, StandardProps} from "@material-ui/core"
import {ImageUtils} from "../utils/imageUtils"

const useStyles = makeStyles((theme) => ({
  img: {
    maxHeight: "100%",
    maxWidth: "100%",
    height: "100%",
  },
}))

interface AppLogoProps extends StandardProps<PaperProps, "root" | "img"> {
  size?: "sm" | "md" | "lg" | "xl"
  withText?: boolean
  noBackground?: boolean
  rounded?: boolean
}

export default function AppLogo(props: AppLogoProps) {
  const classes = useStyles()
  const path = `branding/logos/${props.withText ? "icon_text" : "icon"}-${
    props.noBackground ? "empty_bg" : "white_bg"
  }${!props.withText && props.rounded ? "-rounded" : ""}`
  const imgProps = ImageUtils.getImageProps(path, "Flok Logo", props.size)
  return (
    <Box {...props}>
      <img src={imgProps.src} alt={imgProps.alt} className={classes.img} />
    </Box>
  )
}
