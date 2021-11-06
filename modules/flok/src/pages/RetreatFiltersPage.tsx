import {Button, Grid, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import {RetreatFilter} from "../components/base/AppFilters"
import AppTypography from "../components/base/AppTypography"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {ResourceNotFound} from "../models"
import {AppRoutes} from "../Stack"
import {putRetreatFilters} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import {useRetreat, useRetreatFilters} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  filterSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
    marginBottom: theme.spacing(3),
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

  function onSelect(values: string[]) {
    dispatch(
      putRetreatFilters(
        retreatGuid,
        values.map((val) => parseInt(val))
      )
    )
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
            <PageHeader
              preHeader={<AppLodgingFlowTimeline currentStep="FILTER_SELECT" />}
              header="Tell us about your perfect retreat"
              subheader="We’ve planned dozens of retreats, and these questions come up a lot."
              retreat={
                retreat && retreat !== ResourceNotFound ? retreat : undefined
              }
            />
            <Grid container>
              <Grid item xs={12} md={6} className={classes.filterSection}>
                <AppTypography variant="h3" underline>
                  Location Preferences
                </AppTypography>
                {(
                  filterQuestions?.filter(
                    (ques) => ques.question_affinity === "LOCATION"
                  ) ?? []
                ).map((question) => (
                  <RetreatFilter
                    filterQuestion={question}
                    selectedResponsesIds={selectedResponsesIds}
                    onSelect={onSelect}
                  />
                ))}
              </Grid>
              <Grid item xs={12} md={6} className={classes.filterSection}>
                <AppTypography variant="h3" underline>
                  Hotel Preferences
                </AppTypography>
                {(
                  filterQuestions?.filter(
                    (ques) => ques.question_affinity === "LODGING"
                  ) ?? []
                ).map((question) => (
                  <RetreatFilter
                    filterQuestion={question}
                    selectedResponsesIds={selectedResponsesIds}
                    onSelect={onSelect}
                  />
                ))}
              </Grid>
            </Grid>
          </PageOverlay>
        </PageBody>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(RetreatFiltersPage)
