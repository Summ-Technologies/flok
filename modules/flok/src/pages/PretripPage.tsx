import {makeStyles} from "@material-ui/core"
import {useState} from "react"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import BudgetBreakdownView from "../components/pretrip/BudgetBreakdownView"
import BudgetCalculator from "../components/pretrip/BudgetCalculator"
import {
  BUDGET_TOOL_FLOK_RECOMENDATIONS,
  getBudgetBreakdown,
} from "../utils/pretripUtils"

let useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
    "& > *:not(:first-child)": {
      paddingLeft: theme.spacing(1),
    },
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
  overviewHeader: {},
}))

type PretripPageProps = RouteComponentProps<{retreatIdx: string}>

function PretripPage(props: PretripPageProps) {
  let classes = useStyles()
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let [userInput, setUserInput] = useState(BUDGET_TOOL_FLOK_RECOMENDATIONS)
  let [breakdown, setBreakdown] = useState(getBudgetBreakdown(userInput))
  return (
    <PageContainer>
      <PageSidenav activeItem="pretrip" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <div className={classes.section}>
          <div className={classes.overviewHeader}>
            <AppTypography variant="h1">Budget Breakdown Tool</AppTypography>
          </div>
          <BudgetCalculator
            onSubmit={(vals) => {
              setUserInput(vals)
              setBreakdown(getBudgetBreakdown(vals))
            }}
          />
          <BudgetBreakdownView
            breakdown={breakdown}
            breakdownInput={userInput}
          />
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(PretripPage)
