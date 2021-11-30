import {Hidden, IconButton, makeStyles, Popover} from "@material-ui/core"
import {Info} from "@material-ui/icons"
import {useState} from "react"
import {useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {RootState} from "../store"
import {convertGuid} from "../utils"
import {useDestinations, useHotel, useRetreat} from "../utils/lodgingUtils"
import NotFound404Page from "./misc/NotFound404Page"

type ProposalPageProps = RouteComponentProps<{
  retreatGuid: string
  proposalGuid: string
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
  priceRow: {
    display: "flex",
    alignItems: "flex-start",
    alignContent: "flex-start",
    paddingTop: 5,
  },
  infoButton: {
    padding: "0 0 0 5px",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  detailsSection: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      alignItems: "center",
    },
    padding: "5%",
  },
  detailsRow: {
    display: "flex",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
}))

function ProposalPage(props: ProposalPageProps) {
  let classes = useStyles(props)

  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let proposalGuid = convertGuid(props.match.params.proposalGuid)

  let retreat = useRetreat(retreatGuid)
  let proposal = {
    retreat_id: 0,
    hotel_id: 243,
    state: "REVIEW",

    price_estimate: 19000,
    food_cost: 5000,
    taxes_cost: 4000,

    room_cost: 10000,
    avg_room_cost: 300,
    room_notes: ["16 rooms at $199", "8 rooms at $239"],

    fb_min: 5000,
    fb_percent: 0.25,
    fb_notes: [
      "Breakfast Buffet: $45++",
      "Avg. AM/PM Break: $35++",
      "Avg. Lunch Buffet: $65++",
      "Avg. Plated Dinner: $125++",
    ],

    resort_fee: 28.25,
    env_fee: 35,
    ft_notes: [
      "Occupancy tax: 13%",
      "Business Improvement Area Tax: 2%",
      "CA Tourism Assessment Fee: 0.2%",
      "State Tax: $0.43",
      "Meeting Room Tax Rates: 7.75%",
    ],

    notes: [
      "1 Comp Upgrade to Junior Suite",
      "1 VIP Welcome Amenity",
      "Group Rate Available 1 day pre & post event",
      "Included:",
      "Nightly bonfires",
      "Coordinated nature walks",
      "Complimentary WiFi",
      "Sanctuary bicycles for loan",
      "Concierge services",
      "Complimentary self-parking",
    ],
  }
  let hotelsById = useSelector((state: RootState) => state.lodging.hotels)
  console.log(hotelsById)
  let hotel = useHotel("eec6ee8b-a907-4d66-89de-106670c99a0c")

  let destinations = Object.values(useDestinations()[0])

  let [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {hotel === ResourceNotFound ? (
        <NotFound404Page />
      ) : hotel === undefined ? (
        <>Loading...</>
      ) : (
        <PageContainer>
          <PageOverlay
            size="default"
            right={<AppImageGrid images={hotel.imgs} />}>
            <PageHeader
              header={
                <AppTypography variant="h1" noWrap>
                  <b>{hotel.name}</b>{" "}
                  <span className={classes.lightText}>Proposal</span>
                </AppTypography>
              }
              subheader={hotel.description_short} // TODO: tagline or description short
            />
            <div className={classes.overviewContent}>
              <AppTypography variant="h2">
                <b>FlokIQ</b> Hotel Cost Estimate
              </AppTypography>
              <br />
              <div className={classes.priceRow}>
                <AppTypography fontWeight="bold" variant="h2">
                  ~${proposal.price_estimate}
                </AppTypography>
                <IconButton
                  aria-owns="mouse-over-popover"
                  onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                  onMouseLeave={() => setAnchorEl(null)}
                  className={classes.infoButton}>
                  <Info fontSize="small" />
                </IconButton>
                <Popover
                  id="mouse-over-popover"
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  className={classes.popover}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  onClose={() => setAnchorEl(null)}
                  onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                  onMouseLeave={() => setAnchorEl(null)}
                  disableRestoreFocus>
                  <div className={classes.popoverText}>
                    <AppTypography variant="body1">
                      This is our best guess at what your all in cost will be
                      for this Hotel. Note that this is only an estimate and can
                      vary greatly depending on a number of factors.
                    </AppTypography>
                  </div>
                </Popover>
              </div>
              <br />
              <div className={classes.priceRow}>
                <AppTypography fontWeight="bold">
                  ${proposal.room_cost}
                </AppTypography>
                &nbsp;
                <AppTypography fontWeight="light">
                  Approx Room Total
                </AppTypography>
              </div>
              <div className={classes.priceRow}>
                <AppTypography fontWeight="bold">
                  ${proposal.food_cost}
                </AppTypography>
                &nbsp;
                <AppTypography fontWeight="light">
                  Food {"&"} Beverage
                </AppTypography>
              </div>
              <div className={classes.priceRow}>
                <AppTypography fontWeight="bold">
                  ${proposal.taxes_cost}
                </AppTypography>
                &nbsp;
                <AppTypography fontWeight="light">
                  Taxes {"&"} Fees
                </AppTypography>
              </div>
            </div>

            <div className={classes.details}>
              <div className={classes.detailsRow}>
                <div className={classes.detailsSection}>
                  <AppTypography variant="h3" fontWeight="bold">
                    Room Rates
                  </AppTypography>
                  <div className={classes.priceRow}>
                    <AppTypography fontWeight="bold">
                      ${proposal.avg_room_cost}
                    </AppTypography>
                    &nbsp;
                    <AppTypography fontWeight="light">
                      Average Room Cost
                    </AppTypography>
                  </div>
                  <div className={classes.priceRow}>
                    <AppTypography fontWeight="bold">
                      ${proposal.room_cost}
                    </AppTypography>
                    &nbsp;
                    <AppTypography fontWeight="light">
                      Approx Room Total
                    </AppTypography>
                  </div>
                  <br />
                  <AppTypography variant="h4" fontWeight="bold">
                    Room Rate Breakdown
                  </AppTypography>
                  <div>
                    {proposal.room_notes.map((s) => (
                      <AppTypography>{s}</AppTypography>
                    ))}
                  </div>
                </div>
                <div className={classes.detailsSection}>
                  <AppTypography variant="h3" fontWeight="bold">
                    Food and beverage
                  </AppTypography>
                  <div className={classes.priceRow}>
                    <AppTypography fontWeight="bold">
                      ${proposal.fb_min}
                    </AppTypography>
                    &nbsp;
                    <AppTypography fontWeight="light">
                      {"F&B Minimum"}
                    </AppTypography>
                  </div>
                  <div className={classes.priceRow}>
                    <AppTypography fontWeight="bold">
                      {proposal.fb_percent * 100}%
                    </AppTypography>
                    &nbsp;
                    <AppTypography fontWeight="light">
                      {"F&B Minimum"}
                    </AppTypography>
                  </div>
                  <br />
                  <AppTypography variant="h4" fontWeight="bold">
                    Average Meal Costs
                  </AppTypography>
                  <div>
                    {proposal.fb_notes.map((s) => (
                      <AppTypography>{s}</AppTypography>
                    ))}
                  </div>
                </div>
              </div>
              <div className={classes.detailsRow}>
                <div className={classes.detailsSection}>
                  <AppTypography variant="h3" fontWeight="bold">
                    Fees and Taxes
                  </AppTypography>
                  <div className={classes.priceRow}>
                    <AppTypography fontWeight="bold">
                      ${proposal.resort_fee}
                    </AppTypography>
                    &nbsp;
                    <AppTypography fontWeight="light">
                      Resort Fee (per room per night)
                    </AppTypography>
                  </div>
                  <div className={classes.priceRow}>
                    <AppTypography fontWeight="bold">
                      ${proposal.env_fee}
                    </AppTypography>
                    &nbsp;
                    <AppTypography fontWeight="light">
                      Environmental fee (per room per night)
                    </AppTypography>
                  </div>
                  <br />
                  <AppTypography variant="h4" fontWeight="bold">
                    Tax Rates
                  </AppTypography>
                  <div>
                    {proposal.ft_notes.map((s) => (
                      <AppTypography>{s}</AppTypography>
                    ))}
                  </div>
                </div>
                <div className={classes.detailsSection}>
                  <AppTypography variant="h3" fontWeight="bold">
                    Notes
                  </AppTypography>
                  <br />
                  <div>
                    {proposal.notes.map((s) => (
                      <AppTypography>{s}</AppTypography>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Hidden mdUp>
              <AppImageGrid images={hotel.imgs} />
            </Hidden>
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}

export default withRouter(ProposalPage)
