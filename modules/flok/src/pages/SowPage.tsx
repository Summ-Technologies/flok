import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
} from "@material-ui/core"
import {ExpandMore} from "@material-ui/icons"
import {ChangeEvent, useState} from "react"
import {RouteComponentProps, withRouter} from "react-router"
import AppTypography from "../components/base/AppTypography"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"

type SowPageProps = RouteComponentProps<{}>

let useStyles = makeStyles((theme) => ({
  largeBody: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      visibility: "hidden",
      height: "0",
    },
  },
  mobileBody: {
    display: "flex",
    flexDirection: "column",
    visibility: "hidden",
    [theme.breakpoints.down("sm")]: {
      visibility: "visible",
    },
  },
  tabBody: {
    paddingLeft: 16,
    width: "100%",
  },
  serviceOnMobile: {
    borderTop: "3px dotted black",
    padding: 12,
  },
  accordionBody: {
    display: "flex",
    flexDirection: "column",
  },
}))

function SowPage(props: SowPageProps) {
  const [value, setValue] = useState(0)

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  let classes = useStyles(props)

  const baseServices = [
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Lodging
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">Flok Will:</AppTypography>
          <ul>
            <li>
              <AppTypography>
                Work with you to determine the best destination for your retreat
                based on employee locations, budget, and season.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Gather formal proposals from hotels which will include price and
                availability along with general info on multiple hotel options.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Work with you to select the right hotel for your needs. Most
                often, Flok helps teams secure meeting space as well.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Negotiate the hotel contract. Flok has an IATA number and is a
                member of Global Travel Collection. We may be able to negotiate
                exclusive group rates on your behalf.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Ensure that your company and the hotel fulfill all terms of the
                contract and meet deadlines for rooming lists and payments.
              </AppTypography>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Transportation
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">Flok Will:</AppTypography>
          <ul>
            <li>
              <AppTypography>
                Work with your employees individually to make sure they are
                booking the best flight options.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Provide you with a dashboard of when their employees are all
                arriving and departing.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Work with you to put policies in place as it pertains to
                employee flights and ground transportation.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Coordinate all ground transportation while your team is in-
                destination, including getting to and from the airport.
              </AppTypography>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Itinerary Development
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">Flok Will:</AppTypography>
          <ul>
            <li>
              <AppTypography>
                Propose a comprehensive itinerary based around your meeting
                schedule including meals and activities. Vendors include a
                trusted list of vetted caterers, restaurants, tour providers,
                guides, and transportation providers.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Reach out to your employees to understand their dietary
                restrictions and suggest appropriate menus.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                After confirming the itinerary with your Retreat Main Contact,
                Flok will book everything and coordinate with each vendor for a
                seamless retreat experience.
              </AppTypography>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          COVID-19 Restrictions
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">Flok Will:</AppTypography>
          <ul>
            <li>
              <AppTypography>
                Communicate Covid-19 restrictions to all employees based on
                restrictions in arrival and departure countries.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Arrange Covid-19 testing in-destination as required by entry and
                exit requirements or as requested by the client.
              </AppTypography>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Miscellaneous
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">Flok Will:</AppTypography>
          <ul>
            <li>
              <AppTypography>
                Join your Slack channel to answer any questions that employees
                may have.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Provide, on request, add-on services like: on-site coordinators,
                site inspections, facilitators, photographers/videographers,
                swag, etc.
              </AppTypography>
            </li>
            <li>
              <AppTypography>
                Book everything using your corporate card. At the end of the
                offsite, Flok will forward all receipts.
              </AppTypography>
            </li>
          </ul>
        </>
      ),
    },
  ]

  const addOns = [
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          On-Site Coordinator
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">
            <strong>Price:</strong> $2,500 - $5,000 depending on trip length and
            destination
          </AppTypography>
          <AppTypography color="textSecondary">
            <strong>Vendor:</strong> Flok Employee
          </AppTypography>
          <br />
          <AppTypography>
            On-site coordinators handle all the logistics - planned and
            unplanned - so that you can focus on your team and participate in
            the fun! They ensure all of your meetings, meals, activities, and
            transportation go off without a hitch, as well as taking care of any
            unexpected changes. Contact our team for a detailed quote based on
            your destination and trip length. Please note that groups must
            commit to an on-site coordinator prior to signing their hotel
            contract; after that point, Flok can provide a coordinator based on
            staff and hotel availability.{" "}
            <strong>
              On-site coordinators are included for groups larger than 50
              attendees.
            </strong>
          </AppTypography>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Facilitator
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">
            <strong>Price:</strong> $200 - $400 per employee depending on needs
          </AppTypography>
          <AppTypography color="textSecondary">
            <strong>Vendor:</strong> The Leadership Laboratory
          </AppTypography>
          <br />
          <AppTypography>
            The Leadership Laboratory works with you to meet your unique
            facilitation needs. An expert from their team will lead the meeting,
            workshop, or teambuilding activity in person.
          </AppTypography>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Travel Insurance
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">
            <strong>Price:</strong> Variable
          </AppTypography>
          <AppTypography color="textSecondary">
            <strong>Vendor:</strong> G1G
          </AppTypography>
          <br />
          <AppTypography>
            Flok will connect you to G1G to get preferred pricing on any of
            their travel insurance options. Travel insurance requires personal
            information from your employees such as date of birth and state of
            residence. If you’d like Flok to collect this information on our
            attendee registration form, please let your retreat designer know as
            soon as you begin the planning process.{" "}
            <strong>
              Please note, that you can legally only buy cancel-for-any-reason
              travel insurance within 15 days of your first retreat payment
              (typically the hotel contract)
            </strong>
          </AppTypography>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Site Inspection
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">
            <strong>Price:</strong> $2,000 + dependent on destination
          </AppTypography>
          <AppTypography color="textSecondary">
            <strong>Vendor:</strong> Flok Employee
          </AppTypography>
          <br />
          <AppTypography>
            We know it’s a big deal to send your team to a new location, and we
            don’t take that lightly! These visits, which occur prior to signing
            the hotel contract, allow us to be absolutely sure that a venue is
            appropriate for your team and the priorities for your retreat.
            During these trips, we assess the overall condition of the hotel,
            the level of service, the quality of food and beverage, the specific
            spaces your team might use for meetings and events, as well as any
            other amenities that could make your retreat special. We’re happy to
            conduct these inspections on your behalf or for a member of your
            team to join a Flok staff member on the visit. Please consult our
            sales team for a quote for your preferred venue(s).
            <br />
            <strong>
              Site inspections are required for groups of more than 120
              attendees and highly recommended for groups of more than 50.
            </strong>
          </AppTypography>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Vaccine Verification
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">
            <strong>Price:</strong> $375 = $3 per vaccination card upload
          </AppTypography>
          <AppTypography color="textSecondary">
            <strong>Vendor:</strong> Cloud Touch
          </AppTypography>
          <br />
          <AppTypography>
            Vaccine verification is a reality of traveling today, whether to
            enter a country or sit indoors at a restaurant. Cloud Touch can
            collect and verify attendees’ vaccine cards through a custom-branded
            online portal, and provide you with a database of these results.
            Cloud Touch can also collect and verify negative COVID tests prior
            to travel, and conduct daily health surveys via their portal.
          </AppTypography>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Swag or Employee Gifting
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">
            <strong>Price:</strong> $50 - $500 per employee // Request a Quote
          </AppTypography>
          <AppTypography color="textSecondary">
            <strong>Vendor:</strong> Swag.com or Sparkwood Events
          </AppTypography>
          <br />
          <AppTypography>
            For teams that want to distribute branded swag or gifts for
            employees, Flok will connect you to either Swag.com or Sparkwood
            Events, depending on your needs. We can work with these providers
            and your hotel to package and deliver your products directly to
            guest rooms. Please note that swag orders typically require at least
            a 90-day lead time due to supply chain delays.
          </AppTypography>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          Post-Offsite Sizzle Reel
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">
            <strong>Price:</strong> $2,500
          </AppTypography>
          <AppTypography color="textSecondary">
            <strong>Vendor:</strong> ClearMix
          </AppTypography>
          <br />
          <AppTypography>
            Flok will connect you to ClearMix, the specialists in post-retreat
            recap videos. ClearMix’s professional producers will interview three
            team members about their time on the offsite. Then they will collect
            employee trip photos and videos to use as B-roll. This process is
            less expensive and less intrusive than an on-site videographer.
            Employees may be more relaxed without a large camera following them
            around, and they will feel more connected to the final product,
            which they'll want to watch over and over again!
          </AppTypography>
        </>
      ),
    },
    {
      title: (
        <AppTypography variant="h3" uppercase fontWeight="bold">
          POST-OFFSITE BLOG RECAP
        </AppTypography>
      ),
      content: (
        <>
          <AppTypography color="textSecondary">
            <strong>Price:</strong> $400
          </AppTypography>
          <AppTypography color="textSecondary">
            <strong>Vendor:</strong> Flok Employee
          </AppTypography>
          <br />
          <AppTypography>
            Flok rocks retreat recaps! Check out some of our work at{" "}
            <a href="https://goflok.com/blog/">goflok.com</a>. These blog posts
            perform well on social media and are great to show off when you’re
            recruiting employees to join your team.
          </AppTypography>
        </>
      ),
    },
  ]

  return (
    <PageContainer>
      <PageOverlay>
        <PageHeader
          header="Statement of Work"
          subheader="Thank you so much for entrusting the Flok team with your offsite! These are the services you can expect from our team after paying the Flok Planning Fee. We look forward to providing an experience that your employees won’t soon forget!"
        />
        <div className={classes.largeBody}>
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              orientation="vertical"
              indicatorColor="primary">
              <Tab label="Base Services" />
              <Tab label="Add-Ons" />
            </Tabs>
          </Box>
          <div
            role="tabpanel"
            hidden={value !== 0}
            id={"tabpanel-" + 0}
            className={classes.tabBody}>
            {baseServices.map((service) => (
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <IconButton>
                      <ExpandMore />
                    </IconButton>
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  {service.title}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionBody}>
                  {service.content}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
          <div
            role="tabpanel"
            hidden={value !== 1}
            id={"tabpanel-" + 1}
            className={classes.tabBody}>
            {addOns.map((service) => (
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <IconButton>
                      <ExpandMore />
                    </IconButton>
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  {service.title}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionBody}>
                  {service.content}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
        <div className={classes.mobileBody}>
          <AppTypography fontWeight="bold" variant="h2" color="textSecondary">
            Base Services
          </AppTypography>
          <br />
          {baseServices.map((service) => (
            <div className={classes.serviceOnMobile}>
              {service.title}
              {service.content}
              <br />
            </div>
          ))}
          <AppTypography fontWeight="bold" variant="h2" color="textSecondary">
            Add-Ons
          </AppTypography>
          <br />
          {addOns.map((service) => (
            <div className={classes.serviceOnMobile}>
              {service.title}
              {service.content}
              <br />
            </div>
          ))}
        </div>
      </PageOverlay>
    </PageContainer>
  )
}

export default withRouter(SowPage)
