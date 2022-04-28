import {makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import BudgetBreakdownView from "../components/pretrip/BudgetBreakdownView"
import BudgetCalculator from "../components/pretrip/BudgetCalculator"
import {
  BUDGET_TOOL_FLOK_RECOMENDATIONS,
  useBudgetBreakdown,
} from "../utils/pretripUtils"

let useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
    "& > *:not(:first-child)": {
      paddingLeft: theme.spacing(1),
    },
  },
  overviewHeader: {
    marginBottom: theme.spacing(1),
  },
}))

type PretripPageProps = RouteComponentProps<{retreatIdx: string}>

function PretripPage(props: PretripPageProps) {
  let classes = useStyles()
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  console.log("hi")
  return (
    <PageContainer>
      <PageSidenav activeItem="overview" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <div className={classes.section}>
          <div className={classes.overviewHeader}>
            <AppTypography variant="h1">Budget Estimation Tool</AppTypography>
          </div>
          <BudgetCalculator onSubmit={(vals) => {}} />
          <BudgetBreakdownView
            breakdown={useBudgetBreakdown(BUDGET_TOOL_FLOK_RECOMENDATIONS)}
            breakdownInput={BUDGET_TOOL_FLOK_RECOMENDATIONS}
          />
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(PretripPage)
