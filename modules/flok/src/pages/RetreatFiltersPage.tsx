import {Button, Grid, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
import {RetreatFilter} from "../components/lodging/LodgingFilters"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {ResourceNotFound} from "../models"
import {AppRoutes} from "../Stack"
import {putRetreatFilters} from "../store/actions/retreat"
import {useRetreat, useRetreatFilters} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  footerContainer: {
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(2),
    },
  },
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
  retreatIdx: string
}>
function RetreatFiltersPage(props: RetreatFiltersPageProps) {
  // Setup
  let dispatch = useDispatch()
  let classes = useStyles(props)

  // Path params
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat(retreatIdx)
  let [filterQuestions, filterResponses] = useRetreatFilters(retreatIdx)
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
        retreatIdx,
        values.map((val) => parseInt(val))
      )
    )
  }

  return (
    <RetreatRequired retreatIdx={retreatIdx}>
      <PageContainer>
        <PageBody>
          <PageOverlay
            footerBody={
              <PageOverlayFooterDefaultBody>
                <div className={classes.footerContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() =>
                      dispatch(
                        push(
                          AppRoutes.getPath("DestinationsListPage", {
                            retreatIdx: retreatIdx.toString(),
                          })
                        )
                      )
                    }>
                    Next step
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() =>
                      dispatch(
                        push(
                          AppRoutes.getPath("DestinationsListPage", {
                            retreatIdx: retreatIdx.toString(),
                          })
                        )
                      )
                    }>
                    {/*Padded to match size of "next steps" button*/}
                    &nbsp;&nbsp;&nbsp;Skip&nbsp;&nbsp;&nbsp;{" "}
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
              header="Your perfect retreat"
              subheader="Help us, help you! We’ve planned dozens of retreats, and these questions come up a lot."
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
