import {Button, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import {AppSliderInput} from "../components/base/AppSliderInputs"
import AppTypography from "../components/base/AppTypography"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
import DestinationsGrid from "../components/lodging/DestinationsGrid"
import {HotelGridFilters} from "../components/lodging/HotelGrid"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {ResourceNotFound} from "../models"
import {DestinationModel} from "../models/lodging"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {
  deleteSelectedRetreatDestination,
  postAdvanceRetreatState,
  postSelectedRetreatDestination,
} from "../store/actions/retreat"
import {convertGuid, useQuery} from "../utils"
import {useDestinations, useRetreat} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  filterWithEnds: {
    display: "flex",
    alignItems: "center",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  filterBody: {
    border: "solid thin grey",
    borderColor: "rgba(0, 0, 0, 0.23)",
    borderRadius: 20,
    minWidth: 200,
    display: "flex",
    padding: theme.spacing(1),
    flexDirection: "column",
  },
  bigFilters: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

type DestinationsListPageProps = RouteComponentProps<{retreatGuid: string}>
function DestinationsListPage(props: DestinationsListPageProps) {
  let dispatch = useDispatch()
  let classes = useStyles(props)

  // Query/path params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let [convenienceFilterParam, setConvenienceFilterParam] =
    useQuery("convenience")
  let [pleasureFilterParam, setPleasureFilterParam] = useQuery("work")
  let [warmFilterParam, setWarmFilterParam] = useQuery("warm")
  let [beachFilterParam, setBeachFilterParam] = useQuery("beach")

  // API data
  let retreat = useRetreat(retreatGuid)
  let destinationsList = Object.values(useDestinations()[0])

  // Local filter state
  let [convenienceFilter, setConvenienceFilter] = useState<number>(0)
  let [pleasureFilter, setPleasureFilter] = useState<number>(0)
  let [warmFilter, setWarmFilter] = useState<boolean>(false)
  let [beachFilter, setBeachFilter] = useState<boolean>(false)

  useEffect(() => {
    if (
      convenienceFilterParam !== null &&
      !isNaN(parseInt(convenienceFilterParam))
    ) {
      setConvenienceFilter(parseInt(convenienceFilterParam))
    }
  }, [convenienceFilterParam])

  useEffect(() => {
    if (pleasureFilterParam !== null && !isNaN(parseInt(pleasureFilterParam))) {
      setPleasureFilter(parseInt(pleasureFilterParam))
    }
  }, [pleasureFilterParam])
  useEffect(() => {
    setWarmFilter(warmFilterParam === "1")
  }, [warmFilterParam])
  useEffect(() => {
    setBeachFilter(beachFilterParam === "1")
  }, [beachFilterParam])

  // Selected destinations
  let selectedDestinationIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== ResourceNotFound) {
      return retreat.selected_destinations_ids
    }
    return []
  })
  function isDestinationSelected(destination: DestinationModel) {
    return selectedDestinationIds.includes(destination.id)
  }

  // action handlers
  function explore(destination: DestinationModel) {
    dispatch(
      push(
        AppRoutes.getPath("DestinationPage", {
          retreatGuid: retreatGuid,
          destinationGuid: destination.guid,
        })
      )
    )
  }
  function toggleSelect(destination: DestinationModel) {
    if (isDestinationSelected(destination)) {
      dispatch(deleteSelectedRetreatDestination(retreatGuid, destination.id))
    } else {
      dispatch(postSelectedRetreatDestination(retreatGuid, destination.id))
    }
  }
  function onClickNextSteps() {
    if (retreat && retreat !== ResourceNotFound) {
      dispatch(postAdvanceRetreatState(retreatGuid, retreat.state))
    }
    dispatch(
      push(
        AppRoutes.getPath("HotelsListPage", {
          retreatGuid: props.match.params.retreatGuid,
        })
      )
    )
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {!destinationsList ? (
        <>Loading...</>
      ) : (
        <PageContainer>
          <PageOverlay
            footerBody={
              <PageOverlayFooterDefaultBody
                rightText={`${selectedDestinationIds.length} destinations selected`}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClickNextSteps}>
                  Next step
                </Button>
              </PageOverlayFooterDefaultBody>
            }
            right={
              <AppPageSpotlightImage
                imageUrl="https://flok-b32d43c.s3.amazonaws.com/hotels/acqualina_sidebar.png"
                imageAlt="Acqualina beach front with red umbrellas and palm trees"
                imagePosition="bottom-right"
              />
            }>
            <PageHeader
              preHeader={
                <AppLodgingFlowTimeline currentStep="DESTINATION_SELECT" />
              }
              header="Location"
              subheader="Finding the right destination is the first step to a planning a great retreat!"
              postHeader={
                <HotelGridFilters
                  filters={[
                    {
                      filter: "Warm",
                      filterSelected: warmFilter ? "\u2713" : "",
                      popper: <></>,
                      open: false,
                      toggleOpen: () => {
                        setWarmFilterParam(warmFilter ? undefined : "1")
                      },
                    },
                    {
                      filter: "Beach",
                      filterSelected: beachFilter ? "\u2713" : "",
                      popper: <></>,
                      open: false,
                      toggleOpen: () => {
                        setBeachFilterParam(beachFilter ? undefined : "1")
                      },
                    },
                  ]}>
                  <div className={classes.bigFilters}>
                    <div className={classes.filterBody}>
                      <div className={classes.filterWithEnds}>
                        <AppTypography variant="caption">
                          Convenient
                        </AppTypography>
                        <AppSliderInput
                          defaultThumb
                          value={convenienceFilter}
                          onChange={(newVal) =>
                            setConvenienceFilterParam(newVal.toString())
                          }
                          min={0}
                          max={5}
                        />
                        <AppTypography variant="caption">Exotic</AppTypography>
                      </div>
                    </div>
                    <div className={classes.filterBody}>
                      <div className={classes.filterWithEnds}>
                        <AppTypography variant="caption">Work</AppTypography>
                        <AppSliderInput
                          defaultThumb
                          onChange={(val) =>
                            setPleasureFilterParam(val.toString())
                          }
                          value={pleasureFilter}
                          min={0}
                          max={5}
                        />
                        <AppTypography variant="caption">
                          Pleasure
                        </AppTypography>
                      </div>
                    </div>
                  </div>
                </HotelGridFilters>
              }
            />
            <DestinationsGrid
              destinations={destinationsList}
              onExplore={explore}
              onSelect={toggleSelect}
              isSelected={isDestinationSelected}
            />
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}
export default withRouter(DestinationsListPage)
