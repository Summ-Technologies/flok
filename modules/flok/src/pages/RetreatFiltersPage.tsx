import {Box, Button, Grid, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
import {FiltersSection} from "../components/lodging/LodgingFilters"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {AppRoutes} from "../Stack"
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
      <PageContainer>
        <PageBody>
          <PageOverlay
            footerBody={
              <PageOverlayFooterDefaultBody>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      dispatch(
                        push(
                          AppRoutes.getPath("DestinationsListPage", {
                            retreatGuid,
                          })
                        )
                      )
                    }>
                    Next step
                  </Button>
                </div>
              </PageOverlayFooterDefaultBody>
            }
            right={
              <AppPageSpotlightImage
                imageUrl="https://flok-b32d43c.s3.amazonaws.com/hotels/fairmont_sidebar.png"
                imageAlt="Fairmont Austin pool overview in the evening"
                imagePosition="bottom-right"
              />
            }>
            <Box paddingBottom={4}>
              <PageHeader
                preHeader={<AppLodgingFlowTimeline currentStep="INTAKE_2" />}
                header="Let's Get Started"
                subheader="We need just a few details to plan your perfect retreat."
              />
            </Box>
            <Grid container>
              <Grid item xs={12} md={6}>
                <FiltersSection
                  type="LOCATION"
                  onSelect={onSelect}
                  questions={(filterQuestions ?? []).filter(
                    (question) => question.question_affinity === "LOCATION"
                  )}
                  selectedResponsesIds={selectedResponsesIds}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FiltersSection
                  type="HOTEL"
                  onSelect={onSelect}
                  questions={(filterQuestions ?? []).filter(
                    (question) => question.question_affinity === "LODGING"
                  )}
                  selectedResponsesIds={selectedResponsesIds}
                />
              </Grid>
            </Grid>
          </PageOverlay>
        </PageBody>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(RetreatFiltersPage)
