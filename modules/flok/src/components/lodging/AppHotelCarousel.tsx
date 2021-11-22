import {makeStyles} from "@material-ui/core"
import React from "react"
import {HotelModel} from "../../models/lodging"
import {DestinationUtils, useDestinations} from "../../utils/lodgingUtils"
import AppTypography from "../base/AppTypography"

type AppHotelCarouselProps = {
  hotels: HotelModel[]
  onViewHotel: (hotel: HotelModel) => void
}

const imgSize = 200
const imgSizeMobile = 140
let useStyles = makeStyles((theme) => ({
  root: {
    overflowX: "scroll",
    display: "flex",
    flexWrap: "nowrap",
    overflowY: "visible",
    borderRadius: theme.shape.borderRadius,
  },
  card: {
    cursor: "pointer",
    "&:hover $img": {
      filter: "blur(1px) brightness(75%)",
    },
    "&:hover $imgExplore": {
      display: "block",
    },
    borderRadius: theme.shape.borderRadius,
    textAlign: "center",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    width: imgSize + theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      width: imgSizeMobile + theme.spacing(2),
    },
  },
  imgContainer: {
    position: "relative",
  },
  img: {
    width: imgSize,
    height: imgSize,
    [theme.breakpoints.down("sm")]: {
      width: imgSizeMobile,
      height: imgSizeMobile,
    },
    objectFit: "cover",
    borderRadius: theme.shape.borderRadius,
  },
  imgExplore: {
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
}))

export function AppHotelCarousel(props: AppHotelCarouselProps) {
  let classes = useStyles(props)
  let destinations = Object.values(useDestinations()[0])
  return (
    <div className={classes.root}>
      {props.hotels.map((hotel) => (
        <div className={classes.card} onClick={() => props.onViewHotel(hotel)}>
          <div className={classes.imgContainer}>
            <img
              className={classes.img}
              src={hotel.spotlight_img.image_url}
              alt={hotel.spotlight_img.alt}
            />
            <AppTypography className={classes.imgExplore} variant="body1">
              View
            </AppTypography>
          </div>
          <AppTypography variant="h4" noWrap>
            {hotel.name ? hotel.name : "\u00A0"}
          </AppTypography>
          <AppTypography variant="body2" color="textSecondary" uppercase noWrap>
            {destinations.filter(
              (dest) =>
                dest.id === (hotel !== undefined ? hotel.destination_id : -1000)
            )[0]
              ? DestinationUtils.getLocationName(
                  destinations.filter(
                    (dest) =>
                      dest.id ===
                      (hotel !== undefined ? hotel.destination_id : -1000)
                  )[0]
                )
              : "\u00A0"}
          </AppTypography>
        </div>
      ))}
    </div>
  )
}
