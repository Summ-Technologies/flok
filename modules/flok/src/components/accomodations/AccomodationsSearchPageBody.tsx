import {Box, makeStyles, Slide} from "@material-ui/core"
import {useState} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../store"
import AppNumberFilter from "../base/AppNumberFilter"
import AppTypography from "../base/AppTypography"
import GoogleMap from "../google/GoogleMap"
import AccomodationsDetailsOverlay from "./AccomodationsDetailsOverlay"
import AccomodationsList from "./AccomodationsList"

let useStyles = makeStyles((theme) => ({
  root: {
    "& > *:not(:last-child)": {},
  },
}))

type AccomodationsSearchPageBodyProps = {
  selectedAccomodation?: number
  onSelectAccomodation: (id: number) => void
  onDeselectAccomodation: () => void
}

export default function AccomodationsSearchPageBody(
  props: AccomodationsSearchPageBodyProps
) {
  let classes = useStyles(props)
  let accomodations = useSelector(
    (state: RootState) => state.accomodation.accomodations
  )
  let destinations = useSelector(
    (state: RootState) => state.accomodation.destinations
  )
  let [selectedDestination, setSelectedDestination] =
    useState<number | undefined>(undefined)
  return (
    <Box
      className={classes.root}
      position="relative"
      height="100%"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden">
      <Box
        height="100%"
        width="100%"
        flex={4}
        paddingTop={2}
        paddingBottom={2}
        display="flex"
        flexDirection="column">
        <Box paddingLeft={1} paddingRight={1}>
          <AppTypography variant="h2">
            Venues in the United States
          </AppTypography>
          <Box display="flex" paddingBottom={1}>
            <AppNumberFilter
              count={4}
              icon="nights"
              setCount={() => undefined}
            />
            <AppNumberFilter
              count={4}
              icon="nights"
              setCount={() => undefined}
            />
            <AppNumberFilter
              count={4}
              icon="nights"
              setCount={() => undefined}
            />
          </Box>
        </Box>
        <Box overflow="auto">
          <AccomodationsList
            accomodations={accomodations}
            onClickRow={(id: number) => {
              // setFull(true)
              props.onSelectAccomodation(id)
            }}
          />
        </Box>
      </Box>
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
      <Slide direction="up" in={props.selectedAccomodation ? true : false}>
        <Box
          position="absolute"
          top="0"
          left="0"
          display="flex"
          bgcolor="white"
          alignItems="flex-start"
          justifyContent="flex-start"
          height="100%"
          width="100%">
          <AccomodationsDetailsOverlay
            accomodation={Object.values(accomodations)[0]}
            onBack={props.onDeselectAccomodation}
          />
        </Box>
      </Slide>
    </Box>
  )
}
