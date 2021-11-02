import {Box, Grid, makeStyles} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import {AppMultiSelect, AppSingleSelect} from "../components/base/AppFilters"
import AppTypography from "../components/base/AppTypography"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {putRetreatFilters} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import {useRetreat, useRetreatFilters} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  filterSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
}))

type RetreatFiltersPageProps = RouteComponentProps<{
  retreatGuid: string
}>
function RetreatFiltersPage(props: RetreatFiltersPageProps) {
  // Setup
  let dispatch = useDispatch()
  let classes = useStyles(props)

  // Path params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useRetreat(retreatGuid)
  let [filterQuestions, filterResponses] = useRetreatFilters(retreatGuid)
  let [selectedResponsesIds, setSelectedResponsesIds] = useState<string[]>([])
  useEffect(() => {
    setSelectedResponsesIds(
      filterResponses
        ? filterResponses.map((resp) => resp.answer_id.toString())
        : []
    )
  }, [filterResponses, setSelectedResponsesIds])

  function onSelect(val: string) {
    if (selectedResponsesIds.includes(val)) {
      dispatch(
        putRetreatFilters(
          retreatGuid,
          selectedResponsesIds
            .filter((id) => id !== val)
            .map((id) => parseInt(id))
        )
      )
    } else {
      dispatch(
        putRetreatFilters(retreatGuid, [
          ...selectedResponsesIds.map((id) => parseInt(id)),
          parseInt(val),
        ])
      )
    }
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer
        backgroundImage={
          "https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg"
        }>
        <PageBody>
          <PageOverlay>
            <Box paddingBottom={4}>
              <PageHeader
                preHeader={<AppLodgingFlowTimeline currentStep="INTAKE_2" />}
                header="Let's Get Started"
                subheader="We need just a few details to plan your perfect retreat."
              />
            </Box>
            <Grid container>
              {filterQuestions &&
                filterQuestions
                  .filter((question) => !!question.is_multi_select)
                  .map((filterQuestion) => {
                    let options: {label: string; value: string}[] = []
                    let selectedValues: string[] = []
                    filterQuestion.answers.forEach((answer) => {
                      let answerIdStr = answer.id.toString()
                      options.push({label: answer.title, value: answerIdStr})
                      if (selectedResponsesIds.includes(answerIdStr)) {
                        selectedValues.push(answerIdStr)
                      }
                    })
                    return (
                      <Grid item xs={12} className={classes.filterSection}>
                        <AppTypography variant="h4">
                          {filterQuestion.title}
                        </AppTypography>
                        <AppMultiSelect
                          onSelect={onSelect}
                          selectedValues={selectedResponsesIds}
                          options={options}
                        />
                      </Grid>
                    )
                  })}
              {filterQuestions &&
                filterQuestions
                  .filter((question) => !question.is_multi_select)
                  .map((filterQuestion) => {
                    let options: {label: string; value: string}[] = []
                    let selectedValues: string[] = []
                    filterQuestion.answers.forEach((answer) => {
                      let answerIdStr = answer.id.toString()
                      options.push({label: answer.title, value: answerIdStr})
                      if (selectedResponsesIds.includes(answerIdStr)) {
                        selectedValues.push(answerIdStr)
                      }
                    })
                    return (
                      <Grid item xs={12} className={classes.filterSection}>
                        <AppTypography variant="h4">
                          {filterQuestion.title}
                        </AppTypography>
                        <AppSingleSelect
                          onSelect={onSelect}
                          selectedValue={
                            options.filter((option) =>
                              selectedResponsesIds.includes(option.value)
                            )[0]?.value
                          }
                          options={options}
                        />
                      </Grid>
                    )
                  })}
            </Grid>
          </PageOverlay>
        </PageBody>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(RetreatFiltersPage)
