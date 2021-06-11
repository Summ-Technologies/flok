import {makeStyles} from "@material-ui/core"
import React, {PropsWithChildren, useEffect, useRef, useState} from "react"
import config, {GOOGLE_API_KEY, GOOGLE_MAPS_ID_KEY} from "../../config"
import {useScript} from "../../utils"
import AccomodationMapMarker from "./AccomodationMapMarker"

let useStyles = makeStyles((props) => ({
  root: {
    width: "100%",
    minWidth: "100px",
    height: "100%",
  },
}))

const MAP_OPTIONS: google.maps.MapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  zoomControl: false,
  panControl: false,
  streetViewControl: false,
  zoom: 4,
  // center of US
  center: {
    lat: 39.8283,
    lng: -98.5795,
  },
  restriction: {
    latLngBounds: {
      north: 49.3457868,
      west: -124.7844079,
      east: -66.9513812,
      south: 24.7433195,
    },
    strictBounds: false,
  },
  maxZoom: 5,
  minZoom: 4,
  mapId: config.get(GOOGLE_MAPS_ID_KEY),
} as google.maps.MapOptions

type GoogleMapProps = PropsWithChildren<{
  markers: {lat: number; long: number; text: string; id: number}[]
  selectedMarker?: number
  onSelectMarker: (id: number) => void
  onDeselectMarker?: () => void
}>

function GoogleMap(props: GoogleMapProps) {
  let classes = useStyles(props)
  let mapRef = useRef<HTMLDivElement | null>(null)
  let [map, setMap] = useState<google.maps.Map | undefined>(undefined)

  // Was causing resize and move to be slow
  // let [mapResizeHandlerSet, setMapResizeHandlerSet] = useState(false)
  // useEffect(() => {
  //   if (map) {
  //     if (!mapResizeHandlerSet) {
  //       map.addListener("bounds_changed", () => {
  //         if (map) {
  //           let bounds = map.getBounds()
  //           if (bounds) props.onBoundsChanged(bounds)
  //         }
  //       })
  //       setMapResizeHandlerSet(true)
  //     }
  //   }
  // }, [map, mapResizeHandlerSet, setMapResizeHandlerSet, props])

  let [googleMapScriptLoaded] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${config.get(
      GOOGLE_API_KEY
    )}&map_ids=${config.get(GOOGLE_MAPS_ID_KEY)}&callback`
  )

  useEffect(() => {
    if (googleMapScriptLoaded) {
      if (googleMapScriptLoaded && mapRef.current && !map) {
        let map = new google.maps.Map(mapRef.current, MAP_OPTIONS)
        setMap(map)
      }
    }
  }, [googleMapScriptLoaded, mapRef, setMap, map])

  useEffect(() => {
    if (map && props.onDeselectMarker && props.selectedMarker !== undefined) {
      map.addListener("click", () => {
        if (props.onDeselectMarker) props.onDeselectMarker()
      })
    }
  }, [map, props])

  return (
    <div ref={mapRef} className={classes.root}>
      {googleMapScriptLoaded && mapRef.current && google ? (
        <>
          {props.markers.map((marker, i) => {
            return (
              <AccomodationMapMarker
                lat={marker.lat}
                long={marker.long}
                text={marker.text}
                map={map}
                key={i}
                selected={props.selectedMarker === marker.id}
                onClick={() => props.onSelectMarker(marker.id)}
              />
            )
          })}
        </>
      ) : undefined}
    </div>
  )
}

export default React.memo(GoogleMap)
