import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Paper,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
} from "@material-ui/core"
import {ExpandMore} from "@material-ui/icons"
import {makeStyles} from "@material-ui/styles"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme: Theme) => ({
  itineraryRow: {
    width: "100%",
    display: "inline-table",
  },
  accordionContainer: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}))

type AgendaOptionAccordionProps = {}

export default function AgendaOptionAccordion(
  props: AgendaOptionAccordionProps
) {
  let classes = useStyles(props)
  let agendaOptions = [
    {
      title: "ALL WORK",
      overview:
        "This agenda is for a team that has lots to accomplish on their retreat. These groups will be working all day, and will have some time in the evenings for fun events or great dinners to enjoy each other’s company.",
      details: [
        "We’ll request one meeting space that can accommodate your entire team at a minimum. If your team will need additional breakout space, please be sure to indicate the number of breakout rooms your team will need each day and how many attendees each room needs to accommodate.",
        "We recommend dinner on-site the first night. For the following evenings, we can find venues outside the hotel or book another location on property.",
      ],
      itinerary: [
        {
          activities: ["Arrivals & Welcome Reception"],
          locations: ["Hotel venue"],
        },
        {
          activities: ["All Hands Meeting from 9-5 with breakfast and lunch"],
          locations: ["Hotel meeting space (Dinner offsite)"],
        },
        {
          activities: ["All Hands Meeting from 9-5 with breakfast and lunch"],
          locations: ["Hotel meeting space (Dinner offsite)"],
        },
        {
          activities: [
            "Breakfast at leisure (Optional morning meeting)",
            "Departures",
          ],
          locations: ["On own", ""],
        },
      ],
    },
    {
      title: "WORK & PLAY / ALT DAYS",
      overview:
        "This agenda is perfect for a group that wants to get the work out of the way on your first full day on-site and then have an entire day to explore their destination, participate in local activities together, or simply relax and recharge.",
      details: [
        "We’ll request one meeting space that can accommodate your entire team at a minimum. If your team will need additional breakout space, please be sure to indicate the number of breakout rooms your team will need each day and how many attendees each room needs to accommodate.",
        "We recommend dinner on-site the first night. For the following evenings, we can find venues outside the hotel or book another location on property.",
      ],
      itinerary: [
        {
          activities: ["Arrivals & Welcome Reception"],
          locations: ["Hotel venue"],
        },
        {
          activities: ["All Hands Meeting from 9-5 with breakfast and lunch"],
          locations: ["Hotel meeting space (Dinner offsite)"],
        },
        {
          activities: [
            "Breakfast at leisure",
            "Teambuilding and social activities with lunch and dinner",
          ],
          locations: ["On own at hotel", "On or off-site or combination"],
        },
        {
          activities: [
            "Breakfast at leisure (Optional morning meeting)",
            "Departures",
          ],
          locations: ["On own", ""],
        },
      ],
    },
    {
      title: "WORK & PLAY / SPLIT DAYS",
      overview:
        "This agenda works well for teams that need to keep up with company business daily, or just want to dedicate some focused time each day to work. Your team will spend the morning through lunch in the hotel’s meeting space, and then spend the afternoon participating in exciting activities together or enjoying free time.",
      details: [
        "We’ll request one meeting space that can accommodate your entire team at a minimum. If your team will need additional breakout space, please be sure to indicate the number of breakout rooms your team will need each day and how many attendees each room needs to accommodate.",
        "We recommend dinner on-site the first night. For the following evenings, we can find venues outside the hotel or book another location on property.",
      ],
      itinerary: [
        {
          activities: ["Arrivals & Welcome Reception"],
          locations: ["Hotel venue"],
        },
        {
          activities: [
            "All Hands Meeting from 9-1 with breakfast and lunch",
            "Afternoon activities & team dinner",
          ],
          locations: ["Hotel meeting space", "On or off-site"],
        },
        {
          activities: [
            "All Hands Meeting from 9-1 with breakfast and lunch",
            "Afternoon activities & team dinner",
          ],
          locations: ["Hotel meeting space", "On or off-site"],
        },
        {
          activities: [
            "Breakfast at leisure (Optional morning meeting)",
            "Departures",
          ],
          locations: ["On own", ""],
        },
      ],
    },
    {
      title: "ALL PLAY",
      overview:
        "For teams that want to step away from their computers altogether, we can plan an entire retreat dedicated to unique local activities, team building programs, and dedicated time for relaxation.\n\nIn this case, we suggest using the welcome reception and dinner for any opening remarks or presentations (and can arrange audio-visual if necessary).",
      details: [
        "We recommend dinner on-site the first night. For the following evenings, we can find venues outside the hotel or book another location on property.",
      ],
      itinerary: [
        {
          activities: ["Arrivals & Welcome Reception"],
          locations: ["Hotel venue"],
        },
        {
          activities: [
            "Breakfast at leisure",
            "All day activities & team dinner",
          ],
          locations: ["On own", "On or off-site"],
        },
        {
          activities: [
            "Breakfast at leisure",
            "All day activities & team dinner",
          ],
          locations: ["On own", "On or off-site"],
        },
        {
          activities: ["Team breakfast", "Departures"],
          locations: ["Hotel venue", ""],
        },
      ],
    },
  ]
  return (
    <div className={classes.accordionContainer}>
      <AppTypography variant="h2">Agenda Options</AppTypography>
      <br />
      {agendaOptions.map((agenda, idx) => (
        <Accordion defaultExpanded={idx === 0}>
          <AccordionSummary
            expandIcon={
              <IconButton>
                <ExpandMore />
              </IconButton>
            }
            aria-controls="panel1a-content"
            id="panel1a-header">
            <AppTypography variant="h3" fontWeight="bold" color="textSecondary">
              {agenda.title}
            </AppTypography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <div>
                <AppTypography fontWeight="bold">
                  {agenda.overview}
                </AppTypography>
                <ul>
                  {agenda.details.map((detail) => (
                    <li>
                      <AppTypography>{detail}</AppTypography>
                    </li>
                  ))}
                </ul>
              </div>
              <TableContainer component={Paper}>
                {agenda.itinerary.map((dayPlan, i) => (
                  <TableRow className={classes.itineraryRow}>
                    <TableCell>
                      <AppTypography fontWeight="bold">
                        Day {i + 1}
                      </AppTypography>
                    </TableCell>
                    <TableCell>
                      {dayPlan.activities.map((activity) => (
                        <>
                          <AppTypography>{activity}</AppTypography>
                          <br />
                        </>
                      ))}
                    </TableCell>
                    <TableCell>
                      {dayPlan.locations.map((loc) => (
                        <>
                          <AppTypography>{loc}</AppTypography>
                          <br />
                        </>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableContainer>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
