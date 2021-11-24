import {Hidden, makeStyles} from "@material-ui/core"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import AppTypography from "../components/base/AppTypography"
import {AppHotelCarousel} from "../components/lodging/AppHotelCarousel"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {HotelModel} from "../models/lodging"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getHotels} from "../store/actions/lodging"
import {convertGuid} from "../utils"
import {useRetreat} from "../utils/lodgingUtils"

type HotelProposalWaitingPageProps = {retreatGuid: string}

let useStyles = makeStyles((theme) => ({
  body: {
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(3),
    },
  },
  section: {
    "& > h3": {
      marginBottom: theme.spacing(1),
    },
  },
  contactSection: {},
  contact_img: {
    width: 150,
    height: 150,
    objectFit: "cover",
    marginRight: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
  },
  contact_body: {
    display: "flex",
    marginTop: theme.spacing(1),
  },
}))

function HotelProposalWaitingPage(props: HotelProposalWaitingPageProps) {
  let classes = useStyles(props)
  let retreatGuid = convertGuid(props.retreatGuid)
  let retreat = useRetreat(retreatGuid)

  let hotelsById = useSelector((state: RootState) => state.lodging.hotels)
  let dispatch = useDispatch()

  useEffect(() => {
    if (retreat && retreat !== ResourceNotFound) {
      let filters = retreat.selected_hotels_ids
        .map((id) => ` OR id=${id}`)
        .reduce((prev, curr) => prev + curr, "")
        .substr(4)
      dispatch(getHotels(filters))
    }
  }, [retreat, dispatch])

  // Actions
  function onViewHotel(hotel: HotelModel) {
    const newTab = window.open(
      AppRoutes.getPath("HotelPage", {
        retreatGuid: props.retreatGuid,
        hotelGuid: hotel.guid,
      }),
      "_blank"
    )
    newTab?.focus()
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageOverlay
          size="small"
          right={
            <AppPageSpotlightImage
              imageUrl="https://flok-b32d43c.s3.amazonaws.com/hotels/fairmont_sidebar.png"
              imageAlt="Fairmont Austin pool overview in the evening"
              imagePosition="bottom-right"
            />
          }>
          <PageHeader
            header={`Hotel Proposals Submitted 🕑`}
            preHeader={
              <Hidden xsDown>
                <AppLodgingFlowTimeline currentStep="PROPOSAL" halfway />
              </Hidden>
            }
          />
          <div className={classes.body}>
            <div className={classes.section}>
              <AppTypography variant="h3">What's next?</AppTypography>
              <AppTypography variant="body1">
                It's time for us to get to work! We'll reach out to you at{" "}
                <a
                  href={`mailto:${
                    retreat &&
                    retreat !== ResourceNotFound &&
                    retreat.contact_email
                  }`}>
                  {retreat &&
                    retreat !== ResourceNotFound &&
                    retreat.contact_email}
                </a>{" "}
                with updates as we hear back on availability and pricing for
                your selected hotels.
              </AppTypography>
            </div>
            <div className={classes.section}>
              <AppTypography variant="h3">
                Selected Hotels (
                {
                  (retreat && retreat !== ResourceNotFound
                    ? retreat.selected_hotels_ids
                        .map((id) => hotelsById[id])
                        .filter((hotel) => hotel)
                    : []
                  ).length
                }
                )
              </AppTypography>
              <AppHotelCarousel
                hotels={
                  retreat && retreat !== ResourceNotFound
                    ? retreat.selected_hotels_ids
                        .map((id) => hotelsById[id])
                        .filter((hotel) => hotel)
                    : []
                }
                onViewHotel={onViewHotel}
              />
            </div>
            <div className={classes.section}>
              <AppTypography variant="h3">We're here for you!</AppTypography>{" "}
              <div className={classes.contact_body}>
                {retreat &&
                  retreat !== ResourceNotFound &&
                  retreat.flok_sourcing_admin?.avatar_img && (
                    <img
                      className={classes.contact_img}
                      src={retreat.flok_sourcing_admin.avatar_img.image_url}
                      alt={retreat.flok_sourcing_admin.avatar_img.alt}
                    />
                  )}
                <AppTypography variant="body1">
                  {retreat &&
                  retreat !== ResourceNotFound &&
                  retreat.flok_sourcing_admin ? (
                    <>
                      <strong>
                        {retreat.flok_sourcing_admin.first_name}
                        {retreat.flok_sourcing_admin.last_name &&
                          ` ${retreat.flok_sourcing_admin.last_name}`}
                      </strong>{" "}
                      has been assigned as your booking concierge! If you have
                      any questions about the process, feel free to reach out at{" "}
                      <a href={`mailto:${retreat.flok_sourcing_admin.email}`}>
                        {retreat.flok_sourcing_admin.email}
                      </a>{" "}
                      and we'll get back to you ASAP!
                    </>
                  ) : (
                    <>
                      Flok's team of hospitality professionals is here to guide
                      you through every step of your retreat! At any point if
                      you have questions, please reach out to us at{" "}
                      <a href={`mailto:sam@goflok.com`}>sam@goflok.com</a> and
                      we'll get back to you ASAP.
                    </>
                  )}
                </AppTypography>
              </div>
            </div>
          </div>
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}

export default HotelProposalWaitingPage
