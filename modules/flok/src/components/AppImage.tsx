import {Box, makeStyles, StandardProps} from "@material-ui/core"
import React, {PropsWithChildren} from "react"
import {ImageUtils, KnownImageKey} from "../utils/imageUtils"

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  img: {
    height: (props: AppImageProps) => (props.height ? props.height : undefined),
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: (props: AppImageProps) =>
      props.square ? undefined : theme.shape.borderRadius,
  },
}))

interface AppImageProps extends StandardProps<{}, "root"> {
  img: KnownImageKey | string
  square?: boolean
  alt: string
  height?: string | number
}

export default function AppImage(props: PropsWithChildren<AppImageProps>) {
  const classes = useStyles(props)
  let {img, alt, square, ...otherProps} = props
  let isAbsolute = img ? img.toLowerCase().startsWith("http") : false
  return (
    <Box {...otherProps} className={`${classes.root} ${otherProps.className}`}>
      <img
        className={`${classes.img}`}
        src={isAbsolute ? img : ImageUtils.getImageUrl(img)}
        alt={alt}
      />
    </Box>
  )
}
