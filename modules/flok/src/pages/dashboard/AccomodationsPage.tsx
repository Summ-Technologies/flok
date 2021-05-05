import {Box} from "@material-ui/core"
import {PersonRounded} from "@material-ui/icons"
import {useState} from "react"
import {useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AccomodationsList from "../../components/accomodations/AccomodationsList"
import AppNumberFilter from "../../components/base/AppNumberFilter"
import GoogleMap from "../../components/google/GoogleMap"
import PageBody from "../../components/page/PageBody"
import PageSidenav from "../../components/page/PageSidenav"
import {RootState} from "../../store"

type AccomodationsPageProps = RouteComponentProps<{}>
function AccomodationsPage(props: AccomodationsPageProps) {
  let accomodations = useSelector(
    (state: RootState) => state.accomodation.accomodations
  )
  let destinations = useSelector(
    (state: RootState) => state.accomodation.destinations
  )
  let [selectedDestination, setSelectedDestination] = useState<
    number | undefined
  >(undefined)

  return (
    <PageBody fullWidth sideNav={<PageSidenav activeItem="accomodations" />}>
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
          width="100%">
          <Box flex={3} height="100%" width="100%">
            <GoogleMap
              markers={Object.values(destinations).map((dest) => ({
                lat: dest.lat,
                long: dest.long,
                text: dest.name,
                id: dest.id,
              }))}
              selectedMarker={selectedDestination}
              onSelectMarker={(id: number) => setSelectedDestination(id)}
              onDeselectMarker={() => setSelectedDestination(undefined)}
            />
          </Box>
          <Box
            flex={4}
            display="flex"
            flexDirection="column"
            height="100%"
            width="100%">
            <AppNumberFilter
              count={4}
              icon={<PersonRounded fontSize="inherit" />}
              setCount={() => undefined}
            />
            <Box overflow="auto">
              <AccomodationsList
                destinations={destinations}
                accomodations={accomodations}
                selectedDestination={selectedDestination}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </PageBody>
  )
}
export default withRouter(AccomodationsPage)
