import {makeStyles} from "@material-ui/core"
import React, {PropsWithChildren, useEffect, useRef, useState} from "react"
import config, {GOOGLE_API_KEY} from "../../config"
import {useScript} from "../../utils"
import AccomodationMapMarker from "./AccomodationMapMarker"

let useStyles = makeStyles((props) => ({
  root: {
    width: "100%",
    minWidth: "100px",
    height: "100%",
  },
}))

const MAP_OPTIONS = {
  mapTypeControl: false,
  fullscreenControl: false,
  zoomControl: false,
  panControl: false,
  streetViewControl: false,
  zoom: 4,
  center: {
    lat: 39.8283,
    lng: -98.5795,
  },
  maxZoom: 10,
  minZoom: 3,
  mapId: "5eb717f27eeddaee",
} as google.maps.MapOptions

type GoogleMapProps = PropsWithChildren<{
  markers: {lat: number; long: number; text: string}[]
}>

function GoogleMap(props: GoogleMapProps) {
  let classes = useStyles(props)
  let mapRef = useRef<HTMLDivElement | null>(null)
  let [map, setMap] = useState<google.maps.Map | undefined>(undefined)

  let [googleMapScriptLoaded] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${config.get(
      GOOGLE_API_KEY
    )}&map_ids=5eb717f27eeddaee&callback`
  )

  useEffect(() => {
    if (googleMapScriptLoaded) {
      if (googleMapScriptLoaded && mapRef.current && !map) {
        let map = new google.maps.Map(mapRef.current, MAP_OPTIONS)
        setMap(map)
      }
    }
  }, [googleMapScriptLoaded, mapRef, setMap, map])

  return (
    <div id="accomodation-map" ref={mapRef} className={classes.root}>
      {googleMapScriptLoaded && mapRef.current && google ? (
        <>
          {props.markers.map((marker) => {
            return (
              <AccomodationMapMarker
                lat={37.774}
                long={-122.419}
                text="Testing 1233434234"
                map={map}
              />
            )
          })}
          {/* {props.children} */}
        </>
      ) : undefined}
    </div>
  )
}

export default React.memo(GoogleMap)
