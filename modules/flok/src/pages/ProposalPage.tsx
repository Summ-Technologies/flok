import {Hidden, makeStyles} from "@material-ui/core"
import clsx from "clsx"
import {useEffect, useState} from "react"
import {RouteComponentProps, withRouter} from "react-router"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound, ResourceNotFoundType} from "../models"
import {HotelModel} from "../models/lodging"
import {HotelLodgingProposal} from "../models/retreat"
import {AppRoutes} from "../Stack"
import {convertGuid, useQuery} from "../utils"
import {useHotel, useRetreat} from "../utils/lodgingUtils"
import NotFound404Page from "./misc/NotFound404Page"

type ProposalPageProps = RouteComponentProps<{
  retreatGuid: string
  hotelGuid: string
}>

let useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
    backgrounColor: "#aaa",
  },
  popoverText: {
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.54)",
    color: "#f0f0f0",
    maxWidth: 350,
  },
  lightText: {
    fontWeight: 300,
  },
  overviewContent: {
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  infoButton: {
    padding: "0 0 0 5px",
  },
  attributesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: theme.spacing(-1),
    marginBottom: theme.spacing(1),
    "& > *": {
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(1),
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
    "&.noHold": {
      backgroundColor: theme.palette.error.light,
    },
    "&.onHold": {
      backgroundColor: theme.palette.success.main,
    },
  },
  details: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: -theme.spacing(2),
    marginTop: -theme.spacing(2),
    "& > $detailsSection": {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
      width: `calc(50% - ${theme.spacing(2)}px)`,
      [theme.breakpoints.down("lg")]: {
        width: "100%",
      },
    },
  },
  detailsNoGallery: {
    "& $detailsSection": {
      width: `calc(50% - ${theme.spacing(2)}px)`,
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    },
  },
  detailsSection: {
    display: "flex",
    flexDirection: "column",
  },
  detail: {
    marginTop: theme.spacing(1),
    "&:first-child": {
      marginTop: theme.spacing(1.5),
    },
    width: "100%",
    paddingLeft: theme.spacing(0.5),
    "& > .MuiTypography-body1": {
      whiteSpace: "pre-wrap",
      paddingLeft: theme.spacing(1),
    },
  },
}))

function ProposalPage(props: ProposalPageProps) {
  let classes = useStyles(props)

  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let hotelGuid = convertGuid(props.match.params.hotelGuid)
  let hotel = useHotel(hotelGuid)
  let retreat = useRetreat(retreatGuid)
  let [proposal, setProposal] = useState<
    HotelLodgingProposal | ResourceNotFoundType | undefined
  >(undefined)
  let [proposalIndexQuery, setProposalIndexQuery] = useQuery("proposal")
  useEffect(() => {
    if (
      retreat &&
      retreat !== ResourceNotFound &&
      hotel &&
      hotel !== ResourceNotFound
    ) {
      let _selectedHotels = retreat.selected_hotels.filter(
        (selectedHotel) => selectedHotel.hotel_id === (hotel as HotelModel)!.id
      )
      let proposalIndex = parseInt(proposalIndexQuery || "0") || 0
      if (
        _selectedHotels.length &&
        _selectedHotels[0].hotel_proposals?.length
      ) {
        if (_selectedHotels[0].hotel_proposals.length > proposalIndex) {
          setProposal(_selectedHotels[0].hotel_proposals[proposalIndex])
        } else {
          setProposalIndexQuery(null)
          setProposal(_selectedHotels[0].hotel_proposals[0])
        }
      } else {
        setProposal(ResourceNotFound)
      }
    }
  }, [retreat, hotel, setProposal, proposalIndexQuery, setProposalIndexQuery])

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {hotel === ResourceNotFound ? (
        <NotFound404Page />
      ) : hotel === undefined ? (
        <>Loading...</>
      ) : (
        <PageContainer>
          <PageOverlay
            size="small"
            right={
              hotel.imgs && hotel.imgs.length ? (
                <AppImageGrid images={hotel.imgs} />
              ) : undefined
            }>
            <PageHeader
              header={
                <AppTypography variant="h1" fontWeight="bold" noWrap>
                  {hotel.name}{" "}
                  <AppTypography variant="inherit" fontWeight="light">
                    Proposal
                  </AppTypography>
                </AppTypography>
              }
              subheader={hotel.description_short}
            />
            {proposal === undefined ? (
              <>Loading...</>
            ) : proposal === ResourceNotFound ? (
              <AppTypography variant="body1">
                Proposal missing or unavailable. View your{" "}
                <a
                  href={AppRoutes.getPath("ProposalsListPage", {
                    retreatGuid,
                  })}>
                  proposals list
                </a>
              </AppTypography>
            ) : (
              <>
                <div className={classes.attributesContainer}>
                  {proposal.dates && (
                    <div className={classes.attributeTag}>
                      <AppTypography variant="body2" noWrap uppercase>
                        Dates
                      </AppTypography>
                      <AppTypography variant="body1" fontWeight="bold">
                        {proposal.dates}
                      </AppTypography>
                    </div>
                  )}
                  {proposal.hold_status && (
                    <div
                      className={clsx(
                        classes.attributeTag,
                        proposal.on_hold ? "onHold" : "noHold"
                      )}>
                      <AppTypography variant="body2" noWrap uppercase>
                        Hold Status
                      </AppTypography>
                      <AppTypography variant="body1" fontWeight="bold">
                        {proposal.on_hold ? "ON HOLD" : "NOT ON HOLD"}
                      </AppTypography>
                    </div>
                  )}
                </div>
                <div
                  className={clsx(
                    classes.details,
                    hotel && hotel.imgs.length
                      ? undefined
                      : classes.detailsNoGallery
                  )}>
                  <div className={classes.detailsSection}>
                    <AppTypography variant="h3" fontWeight="bold">
                      Room Rates
                    </AppTypography>
                    {proposal.guestroom_rates && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Guestroom Rates
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.guestroom_rates}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.approx_room_total && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Approx. Room Total (PRE TAX)
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.approx_room_total}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.resort_fee && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Resort Fee
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.resort_fee}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.tax_rates && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Tax Rates
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.tax_rates}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.additional_fees && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Additional Fees
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.additional_fees}
                        </AppTypography>
                      </div>
                    )}
                  </div>
                  <div className={classes.detailsSection}>
                    <AppTypography variant="h3" fontWeight="bold">
                      Food and beverage
                    </AppTypography>
                    {proposal.food_bev_minimum && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          F&B Minimum
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.food_bev_minimum}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.food_bev_service_fee && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          F&B Service Fee
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.food_bev_service_fee}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.avg_breakfast_price && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Avg. Breakfast Buffet
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.avg_breakfast_price}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.avg_snack_price && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Avg. AM/PM Break
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.avg_snack_price}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.avg_lunch_price && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Avg. Lunch Buffet
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.avg_lunch_price}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.avg_dinner_price && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Avg. Plated Dinner
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.avg_dinner_price}
                        </AppTypography>
                      </div>
                    )}
                  </div>
                  <div className={classes.detailsSection}>
                    <AppTypography variant="h3" fontWeight="bold">
                      Meeting Space
                    </AppTypography>
                    {proposal.meeting_room_rates && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Suggested Meeting Spaces
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.meeting_room_rates}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.meeting_room_tax_rates && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Meeting Room Rates
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.meeting_room_tax_rates}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.meeting_room_tax_rates && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Meeting Room Tax Rates
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.meeting_room_tax_rates}
                        </AppTypography>
                      </div>
                    )}
                  </div>
                  {proposal.cost_saving_notes && (
                    <div className={classes.detailsSection}>
                      <AppTypography variant="h3" fontWeight="bold">
                        Additional Notes
                      </AppTypography>
                      <div className={classes.detail}>
                        <AppTypography variant="body1">
                          {proposal.cost_saving_notes}
                        </AppTypography>
                      </div>
                    </div>
                  )}
                </div>
                <Hidden mdUp>
                  <AppImageGrid images={hotel.imgs} />
                </Hidden>
              </>
            )}
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}

export default withRouter(ProposalPage)
