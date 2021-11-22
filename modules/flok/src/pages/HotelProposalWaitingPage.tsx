import {makeStyles} from "@material-ui/core"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router"
import AppTypography from "../components/base/AppTypography"
import {AppHotelCarousel} from "../components/lodging/AppHotelCarousel"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {RootState} from "../store"
import {getHotels} from "../store/actions/lodging"
import {convertGuid} from "../utils"
import {useRetreat} from "../utils/lodgingUtils"

type HotelProposalWaitingPageProps = RouteComponentProps<{retreatGuid: string}>

let useStyles = makeStyles((theme) => ({
  contact_img: {
    width: 150,
    height: 150,
    objectFit: "cover",
    marginRight: theme.spacing(1),
  },
  contact_body: {
    display: "flex",
    marginTop: theme.spacing(1),
  },
}))

function HotelProposalWaitingPage(props: HotelProposalWaitingPageProps) {
  let classes = useStyles(props)
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
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
  }, [retreat])

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
              <AppLodgingFlowTimeline currentStep="PROPOSAL" halfway />
            }
          />
          <AppTypography variant="body1">
            We will now negotiate with hotels on your behalf. Once we have an
            update, we will contact you at{" "}
            <a
              href={`mailto:${
                retreat && retreat !== ResourceNotFound && retreat.contact_email
              }`}>
              {retreat && retreat !== ResourceNotFound && retreat.contact_email}
            </a>{" "}
          </AppTypography>
          <br />
          <AppHotelCarousel
            hotels={
              retreat && retreat !== ResourceNotFound
                ? retreat.selected_hotels_ids
                    .map((id) => hotelsById[id])
                    .filter((hotel) => hotel)
                : []
            }
          />
          <br />
          <AppTypography variant="h4">
            We're here with you the whole way
          </AppTypography>{" "}
          <div className={classes.contact_body}>
            {retreat && retreat !== ResourceNotFound && (
              <img
                className={classes.contact_img}
                src={
                  "https://t4.ftcdn.net/jpg/02/19/63/31/360_F_219633151_BW6TD8D1EA9OqZu4JgdmeJGg4JBaiAHj.jpg"
                }
                alt="TODO"
              />
            )}
            <AppTypography variant="body1">
              You've been assigned{" "}
              <strong>
                {retreat && retreat !== ResourceNotFound && "TODO"}
              </strong>{" "}
              as your bookng concierge! If you have any questions, you can email
              him at{" "}
              <a
                href={`mailto:${
                  retreat && retreat !== ResourceNotFound && "sam@goflok.com"
                }`}>
                {retreat && retreat !== ResourceNotFound && "TODO"}
              </a>{" "}
              or reach him during business hours (9am - 6pm) at{" "}
              <a
                href={`tel:${
                  retreat && retreat !== ResourceNotFound && "(555)-123-4567"
                }`}>
                {retreat && retreat !== ResourceNotFound && "TODO"}
              </a>
            </AppTypography>
          </div>
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}

export default withRouter(HotelProposalWaitingPage)
