import {makeStyles} from "@material-ui/core"
import {goBack} from "connected-react-router"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import AppHotelLocationMap from "../components/lodging/AppHotelLocationMap"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader, {PageHeaderBackButton} from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {RootState} from "../store"
import {getHotelById} from "../store/actions/lodging"
import {
  deleteSelectedRetreatHotel,
  postSelectedRetreatHotel,
} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import NotFound404Page from "./misc/NotFound404Page"

let useStyles = makeStyles((theme) => ({
  mapContainer: {
    maxHeight: 430,
    height: "100%",
    marginTop: "auto",

    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

type HotelPageProps = RouteComponentProps<{
  hotelGuid: string
  retreatGuid: string
}>
function HotelPage(props: HotelPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let selectedHotelIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== "NOT_FOUND") {
      return retreat.selected_hotels_ids
    }
    return []
  })
  let hotelId = useSelector(
    (state: RootState) =>
      state.lodging.hotelsGuidMapping[props.match.params.hotelGuid]
  )
  let hotel = useSelector((state: RootState) => {
    if (hotelId && hotelId !== "NOT_FOUND") {
      return state.lodging.hotels[hotelId]
    } else {
      return undefined
    }
  })

  useEffect(() => {
    if (!hotel && hotelId !== "NOT_FOUND") {
      dispatch(getHotelById(props.match.params.hotelGuid))
    }
  }, [props.match.params.hotelGuid, hotel, hotelId, dispatch])

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {hotelId === "NOT_FOUND" ? (
        <NotFound404Page />
      ) : hotel === undefined ? (
        <>Loading...</>
      ) : (
        <PageContainer>
          <PageOverlay
            size="small"
            OverlayFooterProps={{
              cta: selectedHotelIds.includes(hotelId)
                ? "Unselect location"
                : "Select Location",
              onClick: () => {
                if (selectedHotelIds.includes(hotelId as number)) {
                  dispatch(
                    deleteSelectedRetreatHotel(retreatGuid, hotelId as number)
                  )
                } else {
                  dispatch(
                    postSelectedRetreatHotel(retreatGuid, hotelId as number)
                  )
                }
              },
            }}
            right={<AppImageGrid images={hotel.imgs} />}>
            <PageHeader
              header={hotel.name}
              subheader={""}
              preHeader={
                <PageHeaderBackButton onClick={() => dispatch(goBack())} />
              }
            />
            <AppTypography variant="body1" paragraph>
              {hotel.description}
            </AppTypography>
            <div className={classes.mapContainer}>
              <AppHotelLocationMap
                lat={36.96204259329413}
                long={-122.02508367338864}
              />
            </div>
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}
export default withRouter(HotelPage)
