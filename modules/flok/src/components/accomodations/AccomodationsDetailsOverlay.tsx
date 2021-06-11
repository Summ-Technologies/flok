import {Box, Divider, makeStyles} from "@material-ui/core"
import {
  ArrowBackIosRounded,
  FiberManualRecordRounded,
  FlightLandRounded,
  HotelRounded,
  PoolRounded,
} from "@material-ui/icons"
import {AccomodationModel} from "../../models/accomodation"
import AppButton from "../base/AppButton"
import AppTypography from "../base/AppTypography"
import AccomodationsImageGallery from "./AccomodationsImageGallery"

let useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      paddingRight: theme.spacing(4),
      paddingLeft: theme.spacing(4),
    },
  },
  backButtonContainer: {
    color: theme.palette.text.secondary,
  },
  overviewIconsRow: {
    "& > *:not(:first-child)": {
      paddingLeft: theme.spacing(1),
    },
  },
}))

type AccomodationsDetailsOverlayProps = {
  accomodation: AccomodationModel
  onBack: () => void
}

export default function AccomodationsDetailsOverlay(
  props: AccomodationsDetailsOverlayProps
) {
  let classes = useStyles(props)
  return (
    <Box
      className={classes.root}
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      maxWidth={1100}
      paddingTop={4}>
      {/* Header */}
      <Box display="flex" flexDirection="column" width="100%">
        <Box
          className={classes.backButtonContainer}
          display="flex"
          alignItems="center"
          onClick={props.onBack}
          paddingBottom={2}>
          <ArrowBackIosRounded color="inherit" fontSize="inherit" />
          <AppTypography color="inherit" variant="body2">
            back
          </AppTypography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" flexDirection="column">
            <AppTypography variant="body1" color="primary">
              {props.accomodation.city}
            </AppTypography>
            <AppTypography variant="h1">
              {props.accomodation.name}
            </AppTypography>
          </Box>
          <Box display="flex" alignItems="center">
            <AppButton variant="contained" color="primary">
              Request Proposal
            </AppButton>
          </Box>
        </Box>
        <Box paddingLeft={2} paddingRight={2} paddingTop={2} paddingBottom={0}>
          <Divider />
        </Box>
      </Box>
      {/* End Header */}
      {/* Body */}
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        flex={1}
        overflow="auto">
        <Box>
          {/* Overview */}
          <AppTypography variant="h2">Overview</AppTypography>
          <Box className={classes.overviewIconsRow} display="flex" width="100%">
            <Box display="flex" alignItems="center">
              <HotelRounded />
              <AppTypography variant="body1">150 rooms</AppTypography>
            </Box>
            <AppTypography variant="body2">
              <FiberManualRecordRounded fontSize="inherit" />
            </AppTypography>
            <Box display="flex" alignItems="center">
              <FlightLandRounded />
              <AppTypography variant="body1">1 hr from SFO</AppTypography>
            </Box>
            <AppTypography variant="body2">
              <FiberManualRecordRounded fontSize="inherit" />
            </AppTypography>
            <Box display="flex" alignItems="center">
              <PoolRounded />
              <AppTypography variant="body1">1 hr from SFO</AppTypography>
            </Box>
            <AppTypography variant="body2">
              <FiberManualRecordRounded fontSize="inherit" />
            </AppTypography>
            <Box display="flex" alignItems="center">
              <FlightLandRounded />
              <AppTypography variant="body1">1 hr from SFO</AppTypography>
            </Box>
          </Box>
          <AppTypography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </AppTypography>
          <Box
            paddingLeft={2}
            paddingRight={2}
            paddingTop={2}
            paddingBottom={0}>
            <Divider />
          </Box>
        </Box>
        {/* Photos */}
        <Box>
          <AppTypography variant="h2">Photos</AppTypography>
          <AccomodationsImageGallery />
        </Box>
        {/* Request Proposal */}
      </Box>
      {/* End Body */}
    </Box>
  )
}
