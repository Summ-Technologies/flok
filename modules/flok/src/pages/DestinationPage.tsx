import {RouteComponentProps, withRouter} from "react-router-dom"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import PageContainer from "../components/page/PageContainer"
import PageHeader, {PageHeaderBackButton} from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {sampleLandscape, samplePortrait} from "../models"
import {AppRoutes} from "../Stack"

type DestinationPageProps = RouteComponentProps<{}>
function DestinationPage(props: DestinationPageProps) {
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
          header="Lake Tahoe"
          subheader="World class skiing, hiking, boating, and more!"
          preHeader={
            <PageHeaderBackButton to={AppRoutes.getPath("DestinationPage")} />
          }
        />
        <AppTypography variant="body1" paragraph>
          Lake Tahoe the world’s second largest alpine lake, located high up in
          the Sierra Nevada Mountains straddling the border of California and
          Nevada. It’s known for its beaches and ski resorts. On the southwest
          shore, Emerald Bay State Park contains the 1929 Nordic-style mansion
          Vikingsholm. Along the lake’s northeast side, Lake Tahoe Nevada State
          Park includes Sand Harbor Beach and Spooner Lake, a gateway to the
          long-distance Tahoe Rim Trail.
        </AppTypography>
        <AppTypography variant="h4">Why do we love Lake Tahoe?</AppTypography>
        <AppTypography variant="body1" paragraph>
          As both a summer and a winter destination, Lake Tahoe is one of the
          most beautiful places on earth. It’s home to tons of great year round
          activities, as well as world class skiing. Take your team spelunking,
          biking, white water rafter, or a few brews at Rob Nealan’s house!
        </AppTypography>
        <AppTypography variant="h4">
          What makes Lake Tahoe great for retreats?
        </AppTypography>
        <AppTypography variant="body1" paragraph>
          Lake Tahoe’s proximity to the tech hub of the SF Bay area makes it
          convenient for many teams. There’s truly something something for
          everyone at Tahoe. Find an exciting outdoor activity like mountain
          biking to cultivate team bonding. Maybe your team appreciates great
          food, so why not a big team dinner at the top of the mountain with a
          night at Heavenly with a scenic gondola tour to the top. We’re also
          fans of going out for a night on the casino with our team mates to try
          our luck!
        </AppTypography>
      </PageOverlay>
    </PageContainer>
  )
}
export default withRouter(DestinationPage)
