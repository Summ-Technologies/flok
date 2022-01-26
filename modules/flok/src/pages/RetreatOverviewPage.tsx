import {makeStyles} from "@material-ui/core"
import {
  Apartment,
  CalendarToday,
  CheckCircle,
  Error,
  Flight,
  People,
} from "@material-ui/icons"
import {useEffect, useState} from "react"
import {RouteComponentProps, withRouter} from "react-router"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import AppOverviewCard, {
  AppOverviewCardList,
} from "../components/overview/AppOverviewCard"
import AppTodoList from "../components/overview/AppTaskList"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {RetreatModel} from "../models/retreat"
import {convertGuid} from "../utils"
import {useRetreat} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
    "& > *:not(:first-child)": {
      paddingLeft: theme.spacing(1),
    },
  },
  headerIcon: {
    marginRight: theme.spacing(1),
    verticalAlign: "top",
    "&.todo": {
      color: theme.palette.error.main,
    },
    "&.next": {
      color: theme.palette.warning.main,
    },
    "&.completed": {
      color: theme.palette.success.main,
    },
  },
  todoIcon: {},
}))

type RetreatOverviewProps = RouteComponentProps<{retreatGuid: string}>
function RetreatOverview(props: RetreatOverviewProps) {
  let classes = useStyles()
  // Path and query params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useRetreat(retreatGuid) as RetreatModel | undefined

  let [datesOverview, setDatesOverview] = useState<string | undefined>(
    undefined
  )
  let [flightsOverview, setFlightsOverview] = useState<string | undefined>(
    undefined
  )
  useEffect(() => {
    setFlightsOverview(undefined)
    setDatesOverview(undefined)
  }, [setDatesOverview, setFlightsOverview])

  let [attendeesOverview, setAttendeesOverview] = useState<string | undefined>(
    undefined
  )
  useEffect(() => {
    setAttendeesOverview(
      retreat?.preferences_num_attendees_lower?.toString() ?? ""
    )
  }, [retreat?.preferences_num_attendees_lower])

  let [lodgingOverview, setLodgingOverview] = useState<string | undefined>(
    undefined
  )
  useEffect(() => {
    let newVal = undefined
    switch (retreat?.state_lodging) {
      case "NOT_STARTED":
        break
      case "PROPOSALS_WAITING":
        newVal = "Gathering proposals"
        break
      case "PROPOSALS_VIEW":
        newVal = "Reviewing venues"
        break
      case "CONTRACT_NEGOTIATION":
        newVal = "Negotiating contract"
        break
      case "BOOKED":
        newVal = "Booked"
        break
    }
    setLodgingOverview(newVal)
  }, [retreat?.state_lodging])

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageSidenav
          activeItem="overview"
          retreatGuid={retreatGuid}
          companyName={retreat?.company_name}
        />
        <PageBody>
          <div className={classes.section}>
            <AppTypography variant="h1" paragraph>
              Overview
            </AppTypography>
            <AppOverviewCardList>
              <AppOverviewCard
                label="Dates"
                Icon={CalendarToday}
                value={datesOverview}
              />
              <AppOverviewCard
                label="Attendees"
                Icon={People}
                value={attendeesOverview}
              />
              <AppOverviewCard
                label="Lodging"
                Icon={Apartment}
                value={lodgingOverview}
              />
              <AppOverviewCard
                label="Flights"
                Icon={Flight}
                value={flightsOverview}
              />
            </AppOverviewCardList>
          </div>
          <div className={classes.section}>
            <AppTypography variant="h4" paragraph>
              <Error
                color="inherit"
                className={`${classes.headerIcon} todo`}
                fontSize="small"
              />
              To Do List
            </AppTypography>
            {retreat && (
              <AppTodoList
                retreatToTasks={[
                  {
                    task: {
                      id: 1,
                      description:
                        "We typically recommend one with all attendees (#flok-dunder-mifflin-all), so that we can collect and share important information, and one for planning admins (#flok-dunder-mifflin-admin). Please send invites to jared@goflok.com, and harris@goflok.com. We’ll be going over a lot of details over the course of planning and have found it’s easier to follow conversations in Slack versus email.",
                      title: "Add Flok to two shared Slack Channels",
                      link: "slack.com",
                      user_complete: true,
                    },
                    order: 1,
                    state: "TODO",
                    due_date: new Date(),
                  },
                  {
                    task: {
                      id: 2,
                      title: "Fill out RMC Survey",
                      link: "https://docs.google.com/forms/d/e/1FAIpQLSe_u9Ys3UiGXWT79wmnbNNCLK8xsaQW8Nb6HuWKHyYKTEbPEQ/viewform",
                      user_complete: false,
                    },
                    order: 2,
                    state: "TODO",
                    due_date: new Date(),
                  },
                ]}
              />
            )}
          </div>
          <div className={classes.section}>
            <AppTypography variant="h4" paragraph>
              <CheckCircle
                color="inherit"
                className={`${classes.headerIcon} completed`}
                fontSize="small"
              />
              Completed
            </AppTypography>
            {retreat && (
              <AppTodoList
                retreatToTasks={[
                  {
                    task: {
                      id: 3,
                      title: "Review Attendee Registration Form",
                      link: "https://docs.google.com/forms/d/e/1FAIpQLSfoPCrGTfQ0zanS1FBPgkpyCz_qHBJk967QUnH2T1o1kDo93A/viewform",
                      user_complete: false,
                    },
                    order: 0,
                    state: "COMPLETED",
                  },
                ]}
              />
            )}
          </div>
        </PageBody>
      </PageContainer>
    </RetreatRequired>
  )
}

export default withRouter(RetreatOverview)
