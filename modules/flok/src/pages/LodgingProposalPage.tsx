import {Link as MuiLink, Paper} from "@material-ui/core"
import {LinkRounded} from "@material-ui/icons"
import {Document, Page} from "react-pdf/dist/esm/entry.webpack"
import {Link, RouteComponentProps, withRouter} from "react-router-dom"
import AppProgressStepper from "../components/base/AppProgressStepper"
import AppTypography from "../components/base/AppTypography"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {AppRoutes} from "../Stack"

type LodgingProposalPageProps = RouteComponentProps<{}>
function LodgingProposalPage(props: LodgingProposalPageProps) {
  return (
    <PageContainer>
      <PageSidenav activeItem="lodging" />
      <PageBody
        HeaderProps={{
          header: "Lodging",
          subheader: "GameStop Summer 2021 Retreat",
          progressBar: (
            <AppProgressStepper
              steps={[
                {
                  name: "Add attendees to Slack channel",
                  progress: "IN-PROGRESS",
                },
                {
                  name: "Add Flok with Slack Connect",
                  progress: "TODO",
                },
                {
                  name: "View and manage attendees",
                  progress: "TODO",
                },
              ]}
            />
          ),
        }}>
        <Paper>
          <MuiLink
            to={AppRoutes.getPath("LodgingPage")}
            component={Link}
            variant="body2"
            color="textSecondary">
            {"<"} Back to all proposals
          </MuiLink>
          <AppTypography variant="h4">
            The Ritz-Carlton <LinkRounded color="primary" />
          </AppTypography>
          <Document file="https://flok-b32d43c.s3.us-east-1.amazonaws.com/lodging/proposal-test1.pdf">
            <Page pageNumber={1} />
            <Page pageNumber={2} />
            <Page pageNumber={3} />
          </Document>
        </Paper>
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingProposalPage)
