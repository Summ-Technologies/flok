import {
  Button,
  Card,
  CardActionArea,
  Collapse,
  IconButton,
  makeStyles,
} from "@material-ui/core"
import {MoreVert} from "@material-ui/icons"
import React, {useState} from "react"
import {Document, Page} from "react-pdf/dist/esm/entry.webpack"
import AppImage, {AppImageProps} from "../base/AppImage"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    height: 240,
    padding: theme.spacing(4),
    width: "100%",
  },
  img: {
    height: "100%",
  },
  title: {
    marginLeft: theme.spacing(2),
  },
  menuBtn: {
    marginLeft: theme.spacing(1),
  },
  cta: {
    marginLeft: "auto",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  pdf: {
    boxShadow: theme.shadows[2],
    position: "relative",
    height: 800,
  },
  pdfControls: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: "50%",
    transform: "translateX(-50%)",
  },
}))

type AppLodgingProposalHorizonatlCardProps = {
  header: string
  subheader: string
  stars: 0 | 1 | 2 | 3 | 4 | 5
  ImgProps: AppImageProps // Should always be a 4/3 ratio image
}
export default function AppLodgingProposalHorizonatlCard(
  props: AppLodgingProposalHorizonatlCardProps
) {
  let classes = useStyles(props)
  let [expanded, setExpanded] = useState(false)
  let [numPages, setNumPages] = useState<number | null>(null)
  let [pageNumber, setPageNumber] = useState(1)
  return (
    <Card>
      <CardActionArea
        className={classes.root}
        onClick={() => setExpanded(!expanded)}>
        <AppImage className={classes.img} {...props.ImgProps} />
        <div className={classes.title}>
          <AppTypography variant="h3">{props.header}</AppTypography>
          <AppTypography variant="body1">{props.subheader}</AppTypography>
        </div>
        <Button color="primary" variant="contained" className={classes.cta}>
          Book now
        </Button>
        <IconButton className={classes.menuBtn} size="small">
          <MoreVert />
        </IconButton>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className={classes.body}>
          <Document
            className={classes.pdf}
            renderMode="svg"
            file="https://flok-b32d43c.s3.us-east-1.amazonaws.com/lodging/proposal-test1.pdf"
            onLoadSuccess={({numPages}: {numPages: number}) =>
              setNumPages(numPages)
            }>
            <Page height={798} pageNumber={pageNumber} key={pageNumber} />
            <div className={classes.pdfControls}>
              <Button
                disabled={numPages === null || pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}>
                Previous
              </Button>
              <Button
                disabled={numPages === null || pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}>
                Next
              </Button>
              <p>
                Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
              </p>
            </div>
          </Document>
        </div>
      </Collapse>
    </Card>
  )
}
