import {Button, ButtonBase, makeStyles, Paper} from "@material-ui/core"
import {ArrowRight} from "@material-ui/icons"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import AppTypography from "../components/base/AppTypography"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {RetreatSelectedHotelProposal} from "../models/retreat"
import {RootState} from "../store"
import {getHotels} from "../store/actions/lodging"
import {convertGuid} from "../utils"
import {
  DestinationUtils,
  useDestinations,
  useRetreat,
} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  card: {
    position: "relative",
    display: "flex",
    cursor: "pointer",
    "&:hover": {
      boxShadow: theme.shadows[4],
    },
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    // border: (props: LodgingListItemProps) =>
    //   props.selected ? `solid 1px ${theme.palette.primary.main}` : "",
    // boxShadow: (props: LodgingListItemProps) =>
    //   props.selected ? theme.shadows[2] : "",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2),
    "& > *:not(:first-child):not($tagsContainer)": {
      marginTop: theme.spacing(1),
    },
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 200,
    [theme.breakpoints.down("xs")]: {
      maxWidth: 140,
    },
  },
  imgContainer: {
    position: "relative",
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    height: 150,
    width: 220,
    [theme.breakpoints.down("xs")]: {
      height: 100,
      width: 133,
    },
    "& img": {
      borderRadius: theme.shape.borderRadius,
      objectFit: "cover",
      verticalAlign: "center",
      height: "100%",
      width: "100%",
    },
  },
  attributesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: theme.spacing(-0.5),
    marginBottom: theme.spacing(0.5),
    "& > *": {
      marginBottom: theme.spacing(0.5),
      marginLeft: theme.spacing(0.5),
    },
  },
  attributeTag: {
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: theme.palette.grey[300], // matching chip default background color
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: theme.spacing(-0.5),
    "& > *": {
      marginLeft: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
  },
  exploreArrow: {
    width: 40, // edit children max width if changing this value
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    marginLeft: "auto",
    height: "100%",
  },
  spacer: {
    flexGrow: 2,
  },
  chooseButton: {
    padding: "8px 22px",
  },
}))

type ProposalsListPageProps = {retreatGuid: string}
function ProposalsListPage(props: ProposalsListPageProps) {
  // Setup
  let dispatch = useDispatch()
  let classes = useStyles(props)

  // Path and query params
  let retreatGuid = convertGuid(props.retreatGuid)
  let retreat = useRetreat(retreatGuid)

  // TODO: replace w hotels loaded from retreat
  let hotelsById = useSelector((state: RootState) => state.lodging.hotels)
  let hotelIds = [235, 236, 237, 238, 239, 240, 241, 242, 243]
  useEffect(() => {
    if (retreat && retreat !== ResourceNotFound) {
      let filters = hotelIds
        .map((id) => ` OR id=${id}`)
        .reduce((prev, curr) => prev + curr, "")
        .substr(4)
      console.log(filters)
      dispatch(getHotels(filters))
      console.log(hotelsById)
    }
  }, [retreat, dispatch])
  let destinations = Object.values(useDestinations()[0])

  // Actions
  function onExplore(hotelProposal: RetreatSelectedHotelProposal) {}
  function onChooseProposal(hotelProposal: RetreatSelectedHotelProposal) {}

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageOverlay>
          <PageHeader
            header={`Proposals`}
            subheader="Review proposals from hotels with negotiated prices from our team."
            preHeader={<AppLodgingFlowTimeline currentStep="PROPOSAL" />}
            retreat={
              retreat && retreat !== ResourceNotFound ? retreat : undefined
            }
          />
          <div className={classes.root}>
            {hotelsById &&
              retreat &&
              retreat !== ResourceNotFound &&
              hotelIds //TODO
                .map((k) => hotelsById[k])
                .filter((hotel) => hotel)
                .map((hotel) => (
                  <Paper className={classes.card}>
                    <div className={classes.imgContainer}>
                      <img
                        src={hotel.spotlight_img.image_url}
                        alt={`${hotel.name} spotlight`}
                      />
                    </div>
                    <div className={classes.cardBody}>
                      <div className={classes.headerContainer}>
                        <AppTypography
                          variant="body2"
                          color="textSecondary"
                          uppercase
                          noWrap>
                          {destinations.filter(
                            (dest) => dest.id === hotel.destination_id
                          )[0]
                            ? DestinationUtils.getLocationName(
                                destinations.filter(
                                  (dest) => dest.id === hotel.destination_id
                                )[0],
                                false
                              )
                            : ""}
                        </AppTypography>
                        <AppTypography variant="h4" noWrap>
                          {hotel.name}
                        </AppTypography>
                      </div>
                      <div className={classes.attributesContainer}>
                        <div className={classes.attributeTag}>
                          <AppTypography variant="body2" noWrap uppercase>
                            Avg Room Cost
                          </AppTypography>
                          <AppTypography variant="body1" fontWeight="bold">
                            TODO
                          </AppTypography>
                        </div>
                        <div className={classes.attributeTag}>
                          <AppTypography variant="body2" noWrap uppercase>
                            FlokIq Cost Estimate
                          </AppTypography>
                          <AppTypography variant="body1" fontWeight="bold">
                            TODO
                          </AppTypography>
                        </div>
                      </div>
                    </div>
                    <div className={classes.spacer}></div>
                    <Button
                      className={classes.chooseButton}
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        onChooseProposal({} as RetreatSelectedHotelProposal)
                      }>
                      Choose Proposal
                    </Button>
                    <div className={classes.spacer}></div>
                    <ButtonBase
                      className={classes.exploreArrow}
                      onClick={(e) => {
                        e.stopPropagation()
                        onExplore({} as RetreatSelectedHotelProposal)
                      }}>
                      <ArrowRight fontSize="large" />
                    </ButtonBase>
                  </Paper>
                ))}
          </div>
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}
export default ProposalsListPage
