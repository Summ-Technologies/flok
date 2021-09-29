import {makeStyles} from "@material-ui/core"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  imgContainer: {
    height: "100%",
    width: "100%",
  },
  img: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    objectPosition: (props: AppPageSpotlightImageProps) =>
      props.imagePosition === "bottom-right" ? "bottom right" : "center center",
  },
}))

type AppPageSpotlightImageProps = {
  imageUrl: string
  imageAlt: string
  imagePosition?: "centered" | "bottom-right"
}
export default function AppPageSpotlightImage(
  props: AppPageSpotlightImageProps
) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.imgContainer}>
        <img
          className={classes.img}
          src={props.imageUrl}
          alt={props.imageAlt}
        />
      </div>
    </div>
  )
}
