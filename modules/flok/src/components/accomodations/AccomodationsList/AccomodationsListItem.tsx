import {Box, Divider, makeStyles} from "@material-ui/core"
import {LocalAirportRounded, PersonRounded} from "@material-ui/icons"
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import AppImage from "../../base/AppImage"
import AppTypography from "../../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(1),
    },
    cursor: "pointer",
    "&:hover": {
      boxShadow: theme.shadows[5],
    },
  },
  img: {
    borderRadius: theme.shape.borderRadius,
  },
  detailsRow: {
    display: "flex",
    alignItems: "flex",
    justifyContent: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
}))

type AccomodationsListItemProps = {
  city: string
  name: string
  employees: string
  airport: string
  pricing: string
  img: string
  onClick: () => void
}

export default function AccomodationsListItem(
  props: AccomodationsListItemProps
) {
  let classes = useStyles(props)
  return (
    <Box
      onClick={props.onClick}
      paddingTop={1}
      paddingLeft={1}
      paddingRight={1}
      display="flex"
      flexDirection="column"
      className={classes.root}>
      <Box display="flex">
        <Box
          className={classes.img}
          width={250}
          height={166}
          display="flex"
          alignItems="center">
          <AppImage img={props.img} alt="sup" />
        </Box>
        <Box
          padding={1}
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start">
          <AppTypography variant="body1" color="textSecondary">
            {props.city}
          </AppTypography>
          <AppTypography variant="h3">{props.name}</AppTypography>
          <Box width={40} paddingBottom={0.5} paddingTop={0.5}>
            <Divider />
          </Box>
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
        </Box>
        <Box display="flex" alignItems="flex-end">
          <AppTypography bold variant="body1">
            {props.pricing}
          </AppTypography>
        </Box>
      </Box>
      <Divider />
    </Box>
  )
}
