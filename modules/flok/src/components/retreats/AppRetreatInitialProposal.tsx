import {
  Box,
  Card,
  Grid,
  ListItem,
  makeStyles,
  Typography,
} from "@material-ui/core"
import {
  AttachMoneyRounded,
  DateRangeRounded,
  FlightRounded,
  HomeRounded,
  InfoRounded,
  WbSunnyRounded,
} from "@material-ui/icons"
import React, {PropsWithChildren} from "react"
import {RetreatInitialProposal} from "../../models/retreat"
import AppImage from "../AppImage"
import AppList from "../AppList"

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  logisticsList: {
    [theme.breakpoints.down("xs")]: {
      "& .MuiListItem-root": {
        justifyContent: "flex-end",
      },
    },
  },
  img: {},
}))

type AppRetreatInitialProposalProps = {
  proposal: RetreatInitialProposal
}

export default function AppRetreatInitialProposal(
  props: PropsWithChildren<AppRetreatInitialProposalProps>
) {
  const classes = useStyles()

  return (
    <Card elevation={0} className={classes.root}>
      <Grid container spacing={1}>
        <Grid
          container
          item
          direction="row"
          wrap="wrap"
          xs={12}
          sm={3}
          md={4}
          justify="space-between">
          <Grid item xs={4} sm={12}>
            <AppImage
              className={`${classes.img}`}
              alt={`${props.proposal.title} image`}
              img={props.proposal.imageUrl}
            />
          </Grid>
          <Grid item>
            <AppList className={classes.logisticsList}>
              <ListItem disableGutters>
                <DateRangeRounded />{" "}
                <Typography variant="body2">
                  {props.proposal.numNightsEstimate}
                </Typography>
              </ListItem>
              <ListItem disableGutters>
                <WbSunnyRounded />{" "}
                <Typography variant="body2">
                  {props.proposal.weatherPrediction}
                </Typography>
              </ListItem>
              <ListItem disableGutters>
                <FlightRounded />{" "}
                <Typography variant="body2">
                  {props.proposal.flightTimeAvg}
                </Typography>
              </ListItem>
            </AppList>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={9} md={8}>
          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            alignItems="center">
            <Typography variant="h3">{props.proposal.title}</Typography>
            <Typography variant="body1">{props.proposal.datesRange}</Typography>
          </Box>
          <Typography variant="body1" color="textSecondary">
            {props.proposal.body}
          </Typography>
          <AppList>
            <ListItem disableGutters>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Typography variant="body1">
                  <Box component="span" fontWeight="fontWeightMedium">
                    Estimate
                  </Box>
                </Typography>
                <Typography variant="body1">
                  <Box component="span" fontWeight="fontWeightMedium"></Box>
                </Typography>
              </Box>
            </ListItem>
            <ListItem disableGutters>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Typography variant="body1">
                  <Box component="span" fontWeight="fontWeightMedium">
                    <HomeRounded /> Accomodations
                  </Box>
                </Typography>
                <Typography variant="body1">
                  <Box component="span" fontWeight="fontWeightMedium">
                    {props.proposal.lodgingEstimate}
                  </Box>
                </Typography>
              </Box>
            </ListItem>
            <ListItem disableGutters divider>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Typography variant="body1">
                  <Box component="span" fontWeight="fontWeightMedium">
                    <FlightRounded /> Flights
                  </Box>
                </Typography>
                <Typography variant="body1">
                  <Box component="span" fontWeight="fontWeightMedium">
                    {props.proposal.flightsEstimate}
                  </Box>
                </Typography>
              </Box>
            </ListItem>
            <ListItem disableGutters>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Typography variant="body1">
                  <Box component="span" fontWeight="fontWeightMedium">
                    <AttachMoneyRounded />
                    Total
                    <InfoRounded fontSize="inherit" />
                  </Box>
                </Typography>
                <Typography variant="body1">
                  <Box component="span" fontWeight="fontWeightMedium">
                    {props.proposal.totalEstimate}
                  </Box>
                </Typography>
              </Box>
            </ListItem>
          </AppList>
        </Grid>
      </Grid>
    </Card>
  )
}
