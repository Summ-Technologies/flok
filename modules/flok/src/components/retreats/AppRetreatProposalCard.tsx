import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core"
import {
  FlightRounded,
  HotelRounded,
  InfoOutlined,
  PlaylistAddRounded,
} from "@material-ui/icons"
import {useEffect, useState} from "react"
import AppButton from "../base/AppButton"
import AppTypography from "../base/AppTypography"

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
  cardImg: {
    height: 200,
  },
  cardBody: {
    "& > *:not(:last-child)": {
      // don't add margin to first child because it's h3 tag
      marginBottom: theme.spacing(1),
    },
  },
}))

type AppRetreatProposalCardProps = {
  title: string // name of destination
  subtitle?: string // typically flight time average
  imgUrl: string // landscape image for a 350x200
  numPeople: number // number of employees for retreat
  numNights: number // number of nights for retreat
  flightCost: number // per person
  accomodationCost: number // per person per night
  otherCost: number // per person
  onSelect: () => void
  summary?: boolean
}

export default function AppRetreatProposalCard(
  props: AppRetreatProposalCardProps
) {
  let classes = useStyles()
  let [totalCost, setTotalCost] = useState<number>(0)
  let [perPersonCost, setPerPersonCost] = useState<number>(0)
  let [accomodationCost, setAccomodationCost] = useState<number>(0)

  useEffect(() => {
    let _accomodationCost = props.accomodationCost * props.numNights
    let _perPersonCost = _accomodationCost + props.flightCost
    let _totalCost = _perPersonCost * props.numPeople
    setPerPersonCost(_perPersonCost)
    setTotalCost(_totalCost)
    setAccomodationCost(_accomodationCost)
  }, [
    props.accomodationCost,
    props.numNights,
    props.numPeople,
    props.flightCost,
  ])

  type AppRetreatProposalCardRowProps = {
    icon?: JSX.Element // left icon
    description: JSX.Element // row description (left text)
    info?: string // tooltip content, if set info icon shows
    cost?: JSX.Element // right side of row
  }
  function AppRetreatProposalCardRow(rowProps: AppRetreatProposalCardRowProps) {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex">
          {rowProps.icon ? (
            <Box marginRight={1}>{rowProps.icon}</Box>
          ) : undefined}
          {rowProps.description}
          {rowProps.info ? (
            <Box marginLeft={1}>
              <Typography variant="body1">
                <Tooltip
                  title={
                    "Flights and lodging typically account for about 65% of total trip cost. The remaining budget is allocated for meals and activites, etc."
                  }>
                  <InfoOutlined fontSize="inherit" />
                </Tooltip>
              </Typography>
            </Box>
          ) : undefined}
        </Box>
        {rowProps.cost}
      </Box>
    )
  }

  return (
    <Card className={classes.root}>
      {props.summary ? undefined : (
        <CardMedia
          className={classes.cardImg}
          image={props.imgUrl}
          title={props.title}
        />
      )}
      <CardContent>
        <Box
          className={classes.cardBody}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start">
          {props.summary ? undefined : (
            <>
              <Box marginBottom={0}>
                <AppRetreatProposalCardRow
                  description={
                    <Typography variant="h3">{props.title}</Typography>
                  }
                  cost={
                    <AppTypography bold variant="body1">
                      ${totalCost.toLocaleString()}
                    </AppTypography>
                  }
                />
              </Box>
              <AppRetreatProposalCardRow
                description={
                  <AppTypography italic variant="body2">
                    {props.subtitle}
                  </AppTypography>
                }
              />
              <Divider />
            </>
          )}
          <AppRetreatProposalCardRow
            icon={
              <Typography variant="body1">
                <FlightRounded fontSize="inherit" />
              </Typography>
            }
            description={
              <Typography variant="body1">Average flight cost</Typography>
            }
            cost={
              <Typography variant="body1">
                ${props.flightCost.toLocaleString()}
              </Typography>
            }
          />
          <AppRetreatProposalCardRow
            icon={
              <Typography variant="body1">
                <HotelRounded fontSize="inherit" />
              </Typography>
            }
            description={
              <Typography variant="body1">
                ${props.accomodationCost.toLocaleString()} &#215;{" "}
                {props.numNights} nights
              </Typography>
            }
            cost={
              <Typography variant="body1">
                ${accomodationCost.toLocaleString()}
              </Typography>
            }
          />
          <AppRetreatProposalCardRow
            icon={
              <Typography variant="body1">
                <PlaylistAddRounded fontSize="inherit" />
              </Typography>
            }
            description={<Typography variant="body1">Other</Typography>}
            cost={
              <Typography variant="body1">
                ${props.otherCost.toLocaleString()}
              </Typography>
            }
            info={"Test test test"}
          />
          <Divider />
          <AppRetreatProposalCardRow
            description={
              <Typography variant="body1">Per person estimate</Typography>
            }
            cost={
              <Typography variant="body1">
                ${perPersonCost.toLocaleString()}
              </Typography>
            }
          />
          <Divider />
          <AppRetreatProposalCardRow
            description={
              <AppTypography bold variant="body1">
                Total cost estimate
              </AppTypography>
            }
            cost={
              <AppTypography bold variant="body1">
                ${totalCost.toLocaleString()}
              </AppTypography>
            }
          />
        </Box>
      </CardContent>
      {props.summary ? undefined : (
        <CardActions>
          <Box display="flex" justifyContent="center" width="100%">
            <AppButton
              variant="contained"
              color="primary"
              onClick={props.onSelect}>
              Choose destination
            </AppButton>
          </Box>
        </CardActions>
      )}
    </Card>
  )
}
