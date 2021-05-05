import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Link,
  makeStyles,
} from "@material-ui/core"
import {LocalAirportRounded, PersonRounded} from "@material-ui/icons"
import {useState} from "react"
import {Carousel} from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import AppTypography from "../../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    padding: theme.spacing(2),
  },
  imgCol: {
    width: 250,
    minHeight: 200,
  },
  img: {
    minWidth: 250,
    minHeight: 200,
    borderRadius: theme.shape.borderRadius,
  },
  mainCol: {
    flex: 1,
  },
  detailsRow: {
    display: "flex",
    alignItems: "flex",
    justifyContent: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  pricingCol: {
    display: "flex",
    alignItems: "flex-end",
  },
}))

type AccomodationsListItemProps = {
  city: string
  name: string
  employees: string
  airport: string
  pricing: string
  img: string
}

export default function AccomodationsListItem(
  props: AccomodationsListItemProps
) {
  let classes = useStyles(props)
  let [imageHovered, setImageHovered] = useState(false)
  return (
    <Card elevation={0} className={classes.root}>
      <Box
        onMouseEnter={() => setImageHovered(true)}
        onMouseLeave={() => setImageHovered(false)}>
        <Carousel
          className={classes.imgCol}
          showThumbs={false}
          infiniteLoop
          showArrows={imageHovered}
          showStatus={false}
          showIndicators={false}>
          <CardMedia className={classes.img} image={props.img} title="sup" />
          <CardMedia className={classes.img} image={props.img} title="sup" />
          <CardMedia className={classes.img} image={props.img} title="sup" />
        </Carousel>
      </Box>
      <CardContent className={classes.mainCol}>
        <AppTypography italic variant="body1">
          <Link href="#">{props.city}</Link>
        </AppTypography>
        <AppTypography variant="h3">{props.name}</AppTypography>
        <Divider />
        <Box className={classes.detailsRow}>
          <AppTypography variant="body1">
            <PersonRounded fontSize="inherit" />
          </AppTypography>
          <AppTypography variant="body1">{props.employees}</AppTypography>
        </Box>
        <Box className={classes.detailsRow}>
          <AppTypography variant="body1">
            <LocalAirportRounded fontSize="inherit" />
          </AppTypography>
          <AppTypography variant="body1">{props.airport}</AppTypography>
        </Box>
      </CardContent>
      <CardContent className={classes.pricingCol}>
        <AppTypography underline bold italic variant="body1">
          {props.pricing}
        </AppTypography>
      </CardContent>
    </Card>
  )
}
