import {makeStyles} from "@material-ui/core"
import React from "react"
import {HotelModel} from "../../models/lodging"
import {DestinationUtils, useDestinations} from "../../utils/lodgingUtils"
import AppTypography from "../base/AppTypography"

type AppHotelCarouselProps = {
  hotels: HotelModel[]
}

const imgSize = 200
let useStyles = makeStyles((theme) => ({
  root: {
    overflowX: "scroll",
    display: "flex",
    flexWrap: "nowrap",
    overflowY: "visible",
  },
  card: {
    borderRadius: 10,
    textAlign: "center",
    margin: 12,
    width: imgSize,
  },
  img: {
    width: imgSize,
    height: imgSize,
    objectFit: "cover",
    borderRadius: 4,
  },
}))

export function AppHotelCarousel(props: AppHotelCarouselProps) {
  let classes = useStyles(props)
  let destinations = Object.values(useDestinations()[0])
  return (
    <div className={classes.root}>
      {props.hotels.map((hotel) => (
        <div className={classes.card}>
          <img
            className={classes.img}
            src={hotel.spotlight_img.image_url}
            alt={hotel.spotlight_img.alt}
          />
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
