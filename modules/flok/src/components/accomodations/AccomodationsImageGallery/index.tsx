import {Box, makeStyles} from "@material-ui/core"
import {
  DoubleImageRow,
  SingleImageRow,
  TripleImageRow,
} from "./AccomodationsImageGalleryRow"

let useStyles = makeStyles((theme) => ({
  root: {
    "& > *:not(first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

type AccomodationsImageGalleryProps = {}

export default function AccomodationsImageGallery(
  props: AccomodationsImageGalleryProps
) {
  let classes = useStyles(props)
  return (
    <Box className={classes.root}>
      <SingleImageRow
        img={
          "https://a0.muscache.com/im/pictures/168ec1d9-764c-402e-86ca-f3ba6bfea436.jpg?im_w=1200"
        }
        alt={""}
      />
      <DoubleImageRow
        img1={{
          img: "https://a0.muscache.com/im/pictures/168ec1d9-764c-402e-86ca-f3ba6bfea436.jpg?im_w=1200",
          alt: "",
        }}
        img2={{
          img: "https://a0.muscache.com/im/pictures/168ec1d9-764c-402e-86ca-f3ba6bfea436.jpg?im_w=1200",
          alt: "",
        }}
      />
      <TripleImageRow
        portrait={{
          img: "https://a0.muscache.com/im/pictures/57c20fab-211d-41b2-b909-fd4651f969ac.jpg?im_w=720",
          alt: "",
        }}
        landscape1={{
          img: "https://a0.muscache.com/im/pictures/168ec1d9-764c-402e-86ca-f3ba6bfea436.jpg?im_w=1200",
          alt: "",
        }}
        landscape2={{
          img: "https://a0.muscache.com/im/pictures/168ec1d9-764c-402e-86ca-f3ba6bfea436.jpg?im_w=1200",
          alt: "",
        }}
      />
    </Box>
  )
}
