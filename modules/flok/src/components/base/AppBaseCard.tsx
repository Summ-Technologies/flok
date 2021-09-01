import {makeStyles} from "@material-ui/core"
import React from "react"

let CARD_WIDTH = 260
let useStyles = makeStyles((theme) => ({
  root: {
    width: CARD_WIDTH,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    boxShadow: theme.shadows[2],
  },
  imgContainer: {},
  img: {
    width: CARD_WIDTH,
    height: (CARD_WIDTH * 3) / 4,
    objectFit: "cover",
    display: "block",
  },
  body: {
    width: "100%",
  },
  ctaContainer: {
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}))

type AppBaseCardProps = {
  img: string
  body: JSX.Element
  cta: JSX.Element
}
export default function AppBaseCard(props: AppBaseCardProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.imgContainer}>
        <img src={props.img} alt={"location"} className={classes.img} />
      </div>
      <div className={classes.body}>{props.body}</div>
      <div className={classes.ctaContainer}>{props.cta}</div>
    </div>
  )
}
