import {makeStyles} from "@material-ui/core"
import {useState} from "react"
import {withRouter} from "react-router-dom"
import AppTypography from "../../components/base/AppTypography"
import BudgetBreakdownView from "../../components/budget/BudgetBreakdownView"
import BudgetCalculator from "../../components/budget/BudgetCalculator"
import PageBody from "../../components/page/PageBody"
import {
  BUDGET_TOOL_FLOK_RECOMENDATIONS,
  getBudgetBreakdown,
} from "../../utils/budgetUtils"

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

type BudgetEstimatePageProps = {}

function BudgetEstimatePage(props: BudgetEstimatePageProps) {
  let classes = useStyles()
  let [userInput, setUserInput] = useState(BUDGET_TOOL_FLOK_RECOMENDATIONS)
  let [breakdown, setBreakdown] = useState(getBudgetBreakdown(userInput))
  return (
    <PageBody appBar>
      <div className={classes.section}>
        <div className={classes.overviewHeader}>
          <AppTypography variant="h1">Budget Estimator</AppTypography>
        </div>
        <BudgetCalculator
          onSubmit={(vals) => {
            setUserInput(vals)
            setBreakdown(getBudgetBreakdown(vals))
          }}
        />
        <BudgetBreakdownView breakdown={breakdown} breakdownInput={userInput} />
      </div>
    </PageBody>
  )
}

export default withRouter(BudgetEstimatePage)
