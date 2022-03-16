import {
  Grid,
  Hidden,
  Link,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core"
import {InsertLink} from "@material-ui/icons"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RetreatModel} from "../../models/retreat"
import {RootState} from "../../store"
import {getHotels} from "../../store/actions/lodging"
import AppImageGrid from "../base/AppImageGrid"
import AppLoadingScreen from "../base/AppLoadingScreen"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  header: {},
  websiteLink: {
    marginLeft: theme.spacing(0.5),
  },
  hotelBody: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
    height: "100%",
  },
  hotelDetailsSection: {
    boxShadow: theme.shadows[0],
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1.5),
  },
  imageGridRight: {
    height: "100%",
    flex: 1,
    overflow: "auto",
  },
  overlay: {
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
  },
  overlayBody: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "auto",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
  },
}))

type FinalHotelPageBodyProps = {retreat: RetreatModel; retreatIdx: number}
export default function FinalHotelPageBody(props: FinalHotelPageBodyProps) {
  let {retreat} = {...props}
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let hotel = useSelector((state: RootState) => {
    if (retreat.lodging_final_hotel_id) {
      return state.lodging.hotels[retreat.lodging_final_hotel_id]
    }
  })

  // Probably not the best way to set loading state, but will do for now
  let [loadingHotel, setLoadingHotel] = useState(false)
  useEffect(() => {
    async function loadMissingHotel(id: number) {
      setLoadingHotel(true)
      await dispatch(getHotels([id]))
      setLoadingHotel(false)
    }
    if (!hotel && retreat.lodging_final_hotel_id) {
      loadMissingHotel(retreat.lodging_final_hotel_id)
    }
  }, [hotel, dispatch, setLoadingHotel, retreat.lodging_final_hotel_id])

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h1">
          {!hotel ? (
            "Lodging"
          ) : (
            <>
              {hotel?.name}
              {hotel?.website_url ? (
                <Link
                  href={hotel.website_url}
                  target="_blank"
                  className={classes.websiteLink}>
                  <InsertLink fontSize="inherit" />
                </Link>
              ) : undefined}
            </>
          )}
        </Typography>
        {hotel && (
          <Typography variant="body1">
            Congrats on selecting {hotel.name} for your retreat! Reference back
            here for any resources related to your hotel and hotel contract.
          </Typography>
        )}
      </div>
      {loadingHotel ? (
        <AppLoadingScreen />
      ) : hotel === undefined ? (
        "Oops, something went wrong."
      ) : (
        <Grid container className={classes.hotelBody}>
          <Grid
            item
            xs={12}
            sm={12}
            md={hotel.imgs.length ? 6 : undefined}
            lg={hotel.imgs.length ? 5 : undefined}
            className={classes.overlay}>
            <div className={classes.overlayBody}>
              <Paper className={classes.hotelDetailsSection}>
                <Typography variant="h4">Contract info</Typography>
              </Paper>
              <Paper className={classes.hotelDetailsSection}>
                <Typography variant="h4">Contract info</Typography>
              </Paper>
              <Paper className={classes.hotelDetailsSection}>
                <Typography variant="h4">Contract info</Typography>
              </Paper>
              {hotel.imgs.length ? (
                <Hidden mdUp>
                  <AppImageGrid images={hotel.imgs} />
                </Hidden>
              ) : undefined}
            </div>
          </Grid>
          {hotel.imgs.length ? (
            <Hidden smDown={true}>
              <div className={classes.imageGridRight}>
                <AppImageGrid images={hotel.imgs} />
              </div>
            </Hidden>
          ) : undefined}
        </Grid>
      )}
    </div>
  )
}
