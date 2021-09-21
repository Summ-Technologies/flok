import {makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
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
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getHotelById} from "../store/actions/lodging"
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
    <RetreatRequired retreatGuid={props.match.params.retreatGuid}>
      {hotelId === "NOT_FOUND" ? (
        <NotFound404Page />
      ) : hotel === undefined ? (
        <>Loading...</>
      ) : (
        <PageContainer>
          <PageOverlay
            size="small"
            OverlayFooterProps={{
              cta: "Select Location",
              onClick: () => {
                dispatch(
                  push(
                    AppRoutes.getPath("ChooseHotelPage", {
                      retreatGuid: props.match.params.retreatGuid,
                    })
                  )
                )
              },
            }}
            right={<AppImageGrid images={hotel.imgs} />}>
            <PageHeader
              header={hotel.name}
              subheader={""}
              preHeader={
                <PageHeaderBackButton
                  to={AppRoutes.getPath("ChooseHotelPage", {
                    retreatGuid: props.match.params.retreatGuid,
                  })}
                />
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
