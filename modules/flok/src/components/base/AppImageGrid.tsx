import {makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React, {useEffect, useState} from "react"
import {ImageModel} from "../../models"

let useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}))

type AppImageGridProps = {
  images: ImageModel[]
}
export default function AppImageGrid(props: AppImageGridProps) {
  let classes = useStyles(props)
  let [imageGroups, setImageGroups] = useState<ImageModel[][]>([])
  useEffect(() => {
    let tmpImageGroups: ImageModel[][] = []
    let i = 0
    while (i < props.images.length) {
      tmpImageGroups.push(props.images.slice(i, i + 3))
      i += 3
    }
    setImageGroups(tmpImageGroups)
  }, [props.images, setImageGroups])
  return (
    <div className={classes.root}>
      {imageGroups.map((imgs) => {
        let [l1, l2, l3] = imgs.filter((img) => img.orientation === "landscape")
        let [p1, p2] = imgs.filter((img) => img.orientation === "portrait")
        if (l1 && l2 && l3) {
          return <PackLLL l1={l1} l2={l2} l3={l3} />
        } else if (l1 && l2 && p1) {
          return <PackLLP l1={l1} l2={l2} p1={p1} />
        } else if (l1 && l2) {
          return <PackLL l1={l1} l2={l2} />
        } else if (l1 && p1 && p2) {
          return <PackLPP l1={l1} p1={p1} p2={p2} />
        } else if (l1 && p1) {
          return <PackLP l1={l1} p1={p1} />
        } else if (l1) {
          return <PackL l1={l1} />
        } else if (p1 && p2) {
          return <PackPP p1={p1} p2={p2} />
        } else if (p1) {
          return <PackP p1={p1} />
        } else {
          return <></>
        }
      })}
    </div>
  )
}

let usePackStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  llp: {
    "& $landscapeContainer": {
      paddingTop: "67% !important",
    },
  },
  portraitContainer: {
    position: "relative",
    paddingTop: "133%",
    overflow: "hidden",
    height: 0,
    minHeight: "100%",
    minWidth: "100%",
  },
  landscapeContainer: {
    position: "relative",
    paddingTop: "75%",
    overflow: "hidden",
    height: 0,
    minHeight: "100%",
    minWidth: "100%",
  },
  img: {
    padding: theme.spacing(1),
    position: "absolute",
    top: 0,
    left: 0,
    objectFit: "cover",
    verticalAlign: "bottom",
    height: "100%",
    width: "100%",
    borderRadius: theme.shape.borderRadius,
  },
  half: {
    width: "50%",
  },
  center: {
    margin: "auto",
  },
  row: {
    display: "flex",
    width: "100%",
  },
  col: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
}))

function PackLLL(props: {l1: ImageModel; l2: ImageModel; l3: ImageModel}) {
  let classes = usePackStyles(props)
  return (
    <div className={classes.root}>
      <PackL l1={props.l1} />
      <PackLL l1={props.l2} l2={props.l3} />
    </div>
  )
}
function PackLPP(props: {l1: ImageModel; p1: ImageModel; p2: ImageModel}) {
  let classes = usePackStyles(props)
  return (
    <div className={classes.root}>
      <PackL l1={props.l1} />
      <PackPP p1={props.p1} p2={props.p2} />
    </div>
  )
}
function PackLLP(props: {l1: ImageModel; l2: ImageModel; p1: ImageModel}) {
  let classes = usePackStyles(props)
  return (
    <div className={clsx(classes.root, classes.llp)}>
      <div className={classes.row}>
        <div className={classes.half}>
          <div className={classes.col}>
            <div className={classes.landscapeContainer}>
              <img
                className={classes.img}
                src={props.l1.url}
                alt={props.l1.alt}
              />
            </div>
            <div className={classes.landscapeContainer}>
              <img
                className={classes.img}
                src={props.l2.url}
                alt={props.l2.alt}
              />
            </div>
          </div>
        </div>
        <div className={classes.half}>
          <div className={classes.portraitContainer}>
            <img
              className={classes.img}
              src={props.p1.url}
              alt={props.p1.alt}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PackLL(props: {l1: ImageModel; l2: ImageModel}) {
  let classes = usePackStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <div className={classes.half}>
          <div className={classes.landscapeContainer}>
            <img
              className={classes.img}
              src={props.l1.url}
              alt={props.l1.alt}
            />
          </div>
        </div>
        <div className={classes.half}>
          <div className={classes.landscapeContainer}>
            <img
              className={classes.img}
              src={props.l2.url}
              alt={props.l2.alt}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
function PackLP(props: {l1: ImageModel; p1: ImageModel}) {
  let classes = usePackStyles(props)
  return (
    <div className={clsx(classes.root, classes.llp)}>
      <div className={classes.row}>
        <div className={classes.half}>
          <div className={classes.col}>
            <div className={classes.landscapeContainer}>
              <img
                className={classes.img}
                src={props.l1.url}
                alt={props.l1.alt}
              />
            </div>
          </div>
        </div>
        <div className={classes.half}>
          <div className={classes.portraitContainer}>
            <img
              className={classes.img}
              src={props.p1.url}
              alt={props.p1.alt}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
function PackPP(props: {p1: ImageModel; p2: ImageModel}) {
  let classes = usePackStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <div className={classes.half}>
          <div className={classes.portraitContainer}>
            <img
              className={classes.img}
              src={props.p1.url}
              alt={props.p1.alt}
            />
          </div>
        </div>
        <div className={classes.half}>
          <div className={classes.portraitContainer}>
            <img
              className={classes.img}
              src={props.p2.url}
              alt={props.p2.alt}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
function PackL(props: {l1: ImageModel}) {
  let classes = usePackStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.landscapeContainer}>
        <img className={classes.img} src={props.l1.url} alt={props.l1.alt} />
      </div>
    </div>
  )
}
function PackP(props: {p1: ImageModel}) {
  let classes = usePackStyles(props)
  return (
    <div className={classes.root}>
      <div className={clsx(classes.half, classes.center)}>
        <div className={classes.portraitContainer}>
          <img className={classes.img} src={props.p1.url} alt={props.p1.alt} />
        </div>
      </div>
    </div>
  )
}
