import {makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import AppHotelLocationMap from "../components/lodging/AppHotelLocationMap"
import PageContainer from "../components/page/PageContainer"
import PageHeader, {PageHeaderBackButton} from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {sampleLandscape, samplePortrait} from "../models"
import {AppRoutes} from "../Stack"

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

type HotelPageProps = RouteComponentProps<{}>
function HotelPage(props: HotelPageProps) {
  let classes = useStyles(props)
  return (
    <PageContainer>
      <PageOverlay
        size="small"
        OverlayFooterProps={{
          cta: "Select Location",
          onClick: () => {
            alert("select and go back")
          },
        }}
        right={
          <AppImageGrid
            images={[
              samplePortrait,
              sampleLandscape,
              sampleLandscape,
              samplePortrait,
              samplePortrait,
              sampleLandscape,
              sampleLandscape,
              sampleLandscape,
              sampleLandscape,
            ]}
          />
        }>
        <PageHeader
          header="Dream Inn"
          subheader="A mainstay resort in Santa Cruz, CA with beachfront views."
          preHeader={
            <PageHeaderBackButton to={AppRoutes.getPath("ChooseHotelPage")} />
          }
        />
        <AppTypography variant="body1" paragraph>
          Dream Inn Santa Cruz is the only beachfront resort offering oceanside
          dining with panoramic views of the famous Cowell Beach.
        </AppTypography>
        <div className={classes.mapContainer}>
          <AppHotelLocationMap
            lat={36.96204259329413}
            long={-122.02508367338864}
          />
        </div>
      </PageOverlay>
    </PageContainer>
  )
}
export default withRouter(HotelPage)
