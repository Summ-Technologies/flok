import {Button, makeStyles} from "@material-ui/core"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import AppHotelLocationMap from "../components/lodging/AppHotelLocationMap"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {ResourceNotFound} from "../models"
import {HotelModel} from "../models/lodging"
import {RootState} from "../store"
import {
  deleteSelectedRetreatHotel,
  postSelectedRetreatHotel,
} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import {useHotel} from "../utils/lodgingUtils"
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

  // Query params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let hotelGuid = convertGuid(props.match.params.hotelGuid)

  // Get current hotel
  let hotel = useHotel(hotelGuid)

  // Check if current hotel selected
  let selectedHotelIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== ResourceNotFound) {
      return retreat.selected_hotels_ids
    }
    return []
  })
  function isHotelSelected(id: number) {
    return selectedHotelIds.includes(id)
  }

  function onClickCta() {
    if (hotel && hotel !== ResourceNotFound) {
      if (isHotelSelected((hotel as HotelModel).id)) {
        dispatch(deleteSelectedRetreatHotel(retreatGuid, hotel.id))
      } else {
        dispatch(postSelectedRetreatHotel(retreatGuid, hotel.id))
      }
    }
  }

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
            footerBody={
              <PageOverlayFooterDefaultBody>
                <Button
                  variant={isHotelSelected(hotel.id) ? "contained" : "outlined"}
                  color="primary"
                  onClick={onClickCta}>
                  {isHotelSelected(hotel.id) ? "Selected" : "Select"}
                </Button>
              </PageOverlayFooterDefaultBody>
            }
            right={<AppImageGrid images={hotel.imgs} />}>
            <PageHeader header={hotel.name} subheader={hotel.tagline} />
            <AppTypography variant="body1" paragraph>
              {hotel.description}
            </AppTypography>
            {hotel.address_coordinates ? (
              <div className={classes.mapContainer}>
                <AppHotelLocationMap
                  lat={hotel.address_coordinates[0]}
                  long={hotel.address_coordinates[1]}
                />
              </div>
            ) : undefined}
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}
export default withRouter(HotelPage)
