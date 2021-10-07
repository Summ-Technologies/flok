import {makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React, {useEffect, useRef, useState} from "react"
import AppTypography from "./AppTypography"

let CARD_WIDTH = 260
let useStyles = makeStyles((theme) => ({
  root: {
    width: CARD_WIDTH,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    boxShadow: theme.shadows[3],
    cursor: "pointer",
  },
  explore: {
    boxShadow: theme.shadows[5],
    "& $img": {
      filter: "blur(1px) brightness(75%)",
    },
    "& $imgOverlay": {
      display: "block",
    },
  },
  imgContainer: {
    position: "relative",
  },
  img: {
    width: CARD_WIDTH,
    height: (CARD_WIDTH * 3) / 4,
    objectFit: "cover",
    display: "block",
  },
  imgOverlay: {
    display: "none",

    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.common.white,
    color: theme.palette.common.white,

    padding: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: "rgba(255,255,255,.2)",
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
  onExplore: () => void
}
export default function AppBaseCard(props: AppBaseCardProps) {
  let classes = useStyles(props)

  let rootRef = useRef<HTMLDivElement>(null)
  let [cardHovered, setCardHovered] = useState(false)
  let [ctaHovered, setCtaHovered] = useState(false)

  useEffect(() => {
    if (rootRef.current) {
      let ctaBtn = rootRef.current
        .getElementsByClassName(classes.ctaContainer)[0]
        .getElementsByTagName("button")[0]
      if (ctaBtn) {
        ctaBtn.addEventListener("mouseenter", () => setCtaHovered(true))
        ctaBtn.addEventListener("mouseleave", () => setCtaHovered(false))
      }
    }
  }, [setCtaHovered, rootRef, classes.ctaContainer])

  let [exploreShown, setExploreShown] = useState(false)
  useEffect(() => {
    if (cardHovered && !ctaHovered) {
      setExploreShown(true)
    } else {
      setExploreShown(false)
    }
  }, [cardHovered, ctaHovered, setExploreShown])

  return (
    <div
      ref={rootRef}
      className={clsx(classes.root, exploreShown ? classes.explore : undefined)}
      onClick={() => {
        if (exploreShown) {
          props.onExplore()
        }
      }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}>
      <div className={classes.imgContainer}>
        <img src={props.img} alt={"location"} className={classes.img} />
        <AppTypography className={classes.imgOverlay} variant="h3">
          Explore
        </AppTypography>
      </div>
      <div className={classes.body}>{props.body}</div>
      <div className={classes.ctaContainer}>{props.cta}</div>
    </div>
  )
}
