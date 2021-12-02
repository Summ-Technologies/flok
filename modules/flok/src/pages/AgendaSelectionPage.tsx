import {Hidden, makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLogo from "../components/base/AppLogo"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageFooter from "../components/page/PageFooter"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import AgendaOptionAccordion from "../components/proposal/AgendaOptionAccordion"
import {convertGuid} from "../utils"

type AgendaSelectionPageProps = RouteComponentProps<{retreatGuid: string}>

let useStyles = makeStyles((theme) => ({}))

function AgendaSelectionPage(props: AgendaSelectionPageProps) {
  let classes = useStyles(props)

  let retreatGuid = convertGuid(props.match.params.retreatGuid)

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageOverlay size="small" right={<AgendaOptionAccordion />}>
          <PageHeader
            header="COMPANY RETREAT AGENDAS"
            subheader="Let's get this party started!"
          />
          <div>
            <AppTypography variant="body1">
              We hope you are getting excited about your upcoming retreat. The
              first step before we source your hotel is to choose your preferred
              agenda.
              <br />
              <br />
              Do you want more work, more play, or equal amounts of both?
              Knowing this will allow us to assess your group's meeting space
              requirements and ensure hotel options we present can accommodate
              your needs.
              <br />
              <br />
              Our suggested agendas are based on a 4-day event, with travel on
              first and fourth days. We have All Work, All Play, and combo
              options. These combinations can be adjusted for retreats of any
              length.
              <br />
              <br />
              <strong>Please note:</strong> The agenda you select now is a
              guideline and not set in stone. This gives us a starting point and
              an idea of what you're looking to accomplish with your team. Read
              on for a detailed look at all the possibilities.
            </AppTypography>
          </div>
          <Hidden mdUp>
            <AgendaOptionAccordion />
          </Hidden>
          <Hidden mdDown>
            <PageFooter>
              <AppLogo withText noBackground height={48} />
            </PageFooter>
          </Hidden>
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}

export default withRouter(AgendaSelectionPage)
