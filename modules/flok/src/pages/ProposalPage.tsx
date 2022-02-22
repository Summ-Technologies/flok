import {Hidden, Link, makeStyles, Paper} from "@material-ui/core"
import {InsertLink} from "@material-ui/icons"
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab"
import clsx from "clsx"
import {useEffect, useState} from "react"
import {RouteComponentProps, withRouter} from "react-router"
import AppImageGrid from "../components/base/AppImageGrid"
import AppMoreInfoIcon from "../components/base/AppMoreInfoIcon"
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
import {HotelUtils, useHotel, useRetreat} from "../utils/lodgingUtils"
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
  websiteLink: {
    marginLeft: theme.spacing(0.5),
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
      width: "100%",
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
    boxShadow: theme.shadows[0],
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1.5),
  },
  detail: {
    marginTop: theme.spacing(1),
    width: "100%",
    paddingLeft: theme.spacing(0.5),
    "& > .MuiTypography-body1": {
      whiteSpace: "pre-wrap",
      paddingLeft: theme.spacing(1),
    },
    "& > .MuiTypography-body2": {
      marginBottom: theme.spacing(0.5),
    },
  },
}))

function ProposalPage(props: ProposalPageProps) {
  let classes = useStyles(props)

  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let hotelGuid = convertGuid(props.match.params.hotelGuid)
  let hotel = useHotel(hotelGuid)
  let retreat = useRetreat(retreatGuid)
  let [proposals, setProposals] = useState<HotelLodgingProposal[]>([])
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
      let _proposalIndex = parseInt(proposalIndexQuery || "0") || 0
      if (
        _selectedHotels.length &&
        _selectedHotels[0].hotel_proposals?.length
      ) {
        if (_selectedHotels[0].hotel_proposals.length > _proposalIndex) {
          setProposal(_selectedHotels[0].hotel_proposals[_proposalIndex])
        } else {
          setProposalIndexQuery(null)
          setProposal(_selectedHotels[0].hotel_proposals[0])
        }
      } else {
        setProposal(ResourceNotFound)
      }
    }
  }, [retreat, hotel, setProposal, proposalIndexQuery, setProposalIndexQuery])

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
      if (
        _selectedHotels.length &&
        _selectedHotels[0].hotel_proposals?.length
      ) {
        setProposals(_selectedHotels[0].hotel_proposals)
      }
    }
  }, [retreat, setProposals, hotel])

  useEffect(() => {
    if (hotel && hotel !== ResourceNotFound) {
      document.title = `${hotel.name} Proposal`
    } else if (hotel === ResourceNotFound) {
      document.title = `Proposal Not Found`
    } else {
      document.title = `Lodging Proposal`
    }
  }, [hotel])

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
                <AppTypography variant="h1" fontWeight="bold">
                  {hotel.name}{" "}
                  <AppTypography variant="inherit" fontWeight="light">
                    Proposal
                  </AppTypography>
                  {hotel.website_url ? (
                    <Link
                      href={hotel.website_url}
                      target="_blank"
                      className={classes.websiteLink}>
                      <InsertLink fontSize="inherit" />
                    </Link>
                  ) : undefined}
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
                <div
                  className={clsx(
                    classes.details,
                    hotel && hotel.imgs.length
                      ? undefined
                      : classes.detailsNoGallery
                  )}>
                  <Paper className={classes.detailsSection}>
                    <AppTypography variant="h3" fontWeight="bold">
                      General Info
                    </AppTypography>
                    <div className={classes.detail}>
                      <AppTypography variant="body2" fontWeight="bold">
                        Dates
                      </AppTypography>
                      {proposals.length <= 1 ? (
                        <AppTypography variant="body1">
                          {proposal.dates}
                        </AppTypography>
                      ) : (
                        <ToggleButtonGroup
                          value={proposal.id}
                          exclusive
                          size="small">
                          {proposals.map((_proposal, i) => (
                            <ToggleButton
                              value={_proposal.id}
                              onClick={() => {
                                if (i === 0) {
                                  setProposalIndexQuery(null)
                                } else {
                                  setProposalIndexQuery(i.toString())
                                }
                              }}>
                              {_proposal.dates}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      )}
                    </div>
                    {proposal.dates_note && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Dates Note
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.dates_note}
                        </AppTypography>
                      </div>
                    )}
                    <div className={classes.detail}>
                      <AppTypography variant="body2" fontWeight="bold">
                        Guests
                      </AppTypography>
                      <AppTypography variant="body1">
                        {proposal.num_guests
                          ? proposal.num_guests
                          : retreat !== ResourceNotFound
                          ? retreat!.preferences_num_attendees_lower
                          : undefined}
                      </AppTypography>
                    </div>
                    {hotel.airport_travel_time && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Airport Travel Time{" "}
                          <AppMoreInfoIcon
                            tooltipText={`This travel time is calculated to the nearest major airport${
                              hotel.airport ? `(${hotel.airport})` : ""
                            }. There may be smaller regional airports that are closer.`}
                          />
                        </AppTypography>
                        <AppTypography variant="body1">
                          {HotelUtils.getAirportTravelTime(
                            hotel.airport_travel_time
                          )}
                          {hotel.airport && ` to ${hotel.airport}`}
                        </AppTypography>
                      </div>
                    )}
                  </Paper>
                  <Paper className={classes.detailsSection}>
                    <AppTypography variant="h3" fontWeight="bold">
                      Room Rates
                    </AppTypography>
                    {proposal.guestroom_rates && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Guestroom Rates{" "}
                          <AppMoreInfoIcon
                            tooltipText={
                              "This cost does not include tax and resort fee (if applicable)."
                            }
                          />
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.guestroom_rates}
                        </AppTypography>
                      </div>
                    )}
                    {proposal.approx_room_total && (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Approx. Room Total{" "}
                          <AppMoreInfoIcon
                            tooltipText={
                              "Based on the room rate and anticipated number of attendees. This total is an estimate of rooms only and does not include resort fees (if applicable) or taxes."
                            }
                          />
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
                    {proposal.additional_links?.filter(
                      (link) => link.affinity === "GUESTROOMS"
                    ).length ? (
                      <div className={classes.detail}>
                        <AppTypography variant="body2" fontWeight="bold">
                          Links
                        </AppTypography>
                        <AppTypography variant="body1">
                          {proposal.additional_links
                            ?.filter((link) => link.affinity === "GUESTROOMS")
                            .map((link, currI, currArr) => (
                              <>
                                <Link target="__blank" href={link.link_url}>
                                  {link.link_text}
                                </Link>
                                {currI !== currArr.length - 1 ? (
                                  <br />
                                ) : undefined}
                              </>
                            ))}
                        </AppTypography>
                      </div>
                    ) : undefined}
                  </Paper>
                  {(proposal.food_bev_minimum ||
                    proposal.food_bev_service_fee ||
                    proposal.avg_breakfast_price ||
                    proposal.avg_snack_price ||
                    proposal.avg_lunch_price ||
                    proposal.avg_dinner_price) && (
                    <Paper className={classes.detailsSection}>
                      <AppTypography variant="h3" fontWeight="bold">
                        Food and Beverage
                      </AppTypography>
                      {proposal.food_bev_minimum && (
                        <div className={classes.detail}>
                          <AppTypography variant="body2" fontWeight="bold">
                            F&B Minimum{" "}
                            <AppMoreInfoIcon
                              tooltipText={
                                "This cost does not include tax and service charges."
                              }
                            />
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
                      {proposal.additional_links?.filter(
                        (link) => link.affinity === "FOOD_BEV"
                      ).length ? (
                        <div className={classes.detail}>
                          <AppTypography variant="body2" fontWeight="bold">
                            Links
                          </AppTypography>
                          <AppTypography variant="body1">
                            {proposal.additional_links
                              ?.filter((link) => link.affinity === "FOOD_BEV")
                              .map((link, currI, currArr) => (
                                <>
                                  <Link target="__blank" href={link.link_url}>
                                    {link.link_text}
                                  </Link>
                                  {currI !== currArr.length - 1 ? (
                                    <br />
                                  ) : undefined}
                                </>
                              ))}
                          </AppTypography>
                        </div>
                      ) : undefined}
                    </Paper>
                  )}
                  {(proposal.meeting_room_rates ||
                    proposal.suggested_meeting_spaces ||
                    proposal.meeting_room_tax_rates) && (
                    <Paper className={classes.detailsSection}>
                      <AppTypography variant="h3" fontWeight="bold">
                        Meeting Space
                      </AppTypography>
                      {proposal.suggested_meeting_spaces && (
                        <div className={classes.detail}>
                          <AppTypography variant="body2" fontWeight="bold">
                            Suggested Meeting Spaces
                          </AppTypography>
                          <AppTypography variant="body1">
                            {proposal.suggested_meeting_spaces}
                          </AppTypography>
                        </div>
                      )}
                      {proposal.meeting_room_rates && (
                        <div className={classes.detail}>
                          <AppTypography variant="body2" fontWeight="bold">
                            Meeting Room Rates
                          </AppTypography>
                          <AppTypography variant="body1">
                            {proposal.meeting_room_rates}
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
                      {proposal.additional_links?.filter(
                        (link) => link.affinity === "MEETING_ROOMS"
                      ).length ? (
                        <div className={classes.detail}>
                          <AppTypography variant="body2" fontWeight="bold">
                            Links
                          </AppTypography>
                          <AppTypography variant="body1">
                            {proposal.additional_links
                              ?.filter(
                                (link) => link.affinity === "MEETING_ROOMS"
                              )
                              .map((link, currI, currArr) => (
                                <>
                                  <Link target="__blank" href={link.link_url}>
                                    {link.link_text}
                                  </Link>
                                  {currI !== currArr.length - 1 ? (
                                    <br />
                                  ) : undefined}
                                </>
                              ))}
                          </AppTypography>
                        </div>
                      ) : undefined}
                    </Paper>
                  )}
                  {(proposal.cost_saving_notes ||
                    proposal.additional_links?.length) && (
                    <Paper className={classes.detailsSection}>
                      <AppTypography variant="h3" fontWeight="bold">
                        Additional Info
                      </AppTypography>
                      {proposal.cost_saving_notes && (
                        <div className={classes.detail}>
                          <AppTypography variant="body2" fontWeight="bold">
                            Notes
                          </AppTypography>
                          <AppTypography variant="body1">
                            {proposal.cost_saving_notes}
                          </AppTypography>
                        </div>
                      )}
                      {proposal.additional_links?.filter(
                        (link) => !link.affinity
                      ).length ? (
                        <div className={classes.detail}>
                          <AppTypography variant="body2" fontWeight="bold">
                            Other Resources
                          </AppTypography>
                          <AppTypography variant="body1">
                            {proposal.additional_links
                              ?.filter((link) => !link.affinity)
                              .map((link, currI, currArr) => (
                                <>
                                  <Link target="__blank" href={link.link_url}>
                                    {link.link_text}
                                  </Link>
                                  {currI !== currArr.length - 1 ? (
                                    <br />
                                  ) : undefined}
                                </>
                              ))}
                          </AppTypography>
                        </div>
                      ) : undefined}
                    </Paper>
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
