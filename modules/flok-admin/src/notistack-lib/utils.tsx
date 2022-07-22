import {Button} from "@material-ui/core"
import {OptionsObject, SnackbarKey} from "notistack"
import {useEffect, useState} from "react"

export function apiNotification(
  message: string,
  onClose: (key: SnackbarKey) => void,
  error?: boolean
): {
  key?: SnackbarKey
  message: string
  options?: OptionsObject
  dismissed?: boolean
} {
  return {
    message: message,
    options: {
      action: (key) => (
        <Button color="inherit" onClick={() => onClose(key)}>
          Dismiss
        </Button>
      ),
      variant: error ? "error" : "success",
      persist: false,
      autoHideDuration: 3000,
    },
  }
}

// Hook
export type ScriptLoadingState = "loading" | "idle" | "ready" | "error"
export function useScript(src: string): [boolean, ScriptLoadingState] {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState<ScriptLoadingState>(
    src ? "loading" : "idle"
  )
  const [ready, setReady] = useState(false)

  useEffect(
    () => {
      // Allow falsy src value if waiting on other data needed for
      // constructing the script URL passed to this hook.
      if (!src) {
        setStatus("idle")
        return
      }

      // Fetch existing script element by src
      // It may have been added by another intance of this hook
      let script = document.querySelector<HTMLScriptElement>(
        `script[src="${src}"]`
      )

      if (!script) {
        // Create script
        script = document.createElement("script")
        script.src = src
        script.async = true
        script.setAttribute("data-status", "loading")
        // Add script to document body
        document.body.appendChild(script)

        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event: Event) => {
          if (script) {
            script.setAttribute(
              "data-status",
              event.type === "load" ? "ready" : "error"
            )
          }
        }

        script.addEventListener("load", setAttributeFromEvent)
        script.addEventListener("error", setAttributeFromEvent)
      } else {
        // Grab existing script status from attribute and set to state.
        let _status = script.getAttribute("data-status") as ScriptLoadingState
        if (_status) {
          setStatus(_status)
        }
      }

      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === "load" ? "ready" : "error")
      }

      // Add event listeners
      script.addEventListener("load", setStateFromEvent)
      script.addEventListener("error", setStateFromEvent)

      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener("load", setStateFromEvent)
          script.removeEventListener("error", setStateFromEvent)
        }
      }
    },
    [src] // Only re-run effect if script src changes
  )

  useEffect(() => {
    if (status === "ready") {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [status, setReady])

  return [ready, status]
}

export type GooglePlace = {
  name: string
  place_id: string
  lat?: number
  lng?: number
  type: "ADD_GOOGLE_PLACE"
  address?: string
  city?: string
  state?: string
  country?: string
}

export function fetchGooglePlace(
  placeId: string,
  onFetch: (place: GooglePlace) => void
) {
  // can only call this if google script has been loaded
  let map = new google.maps.Map(document.createElement("div"))
  let service = new google.maps.places.PlacesService(map)
  service.getDetails(
    {
      placeId: placeId,
      fields: ["name", "geometry", "formatted_address", "address_components"],
    },
    (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (place && place.name && place.geometry?.location) {
          console.log("components:", place.address_components)
          let city = ""
          let country = ""
          let state = ""
          if (place.address_components) {
            city =
              place.address_components.find((component) =>
                component.types.includes("locality")
              )?.long_name ?? ""
            state =
              place.address_components.find((component) =>
                component.types.includes("administrative_area_level_1")
              )?.long_name ?? ""
            country =
              place.address_components.find((component) =>
                component.types.includes("country")
              )?.long_name ?? ""
          }
          onFetch({
            name: place.name,
            place_id: placeId,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            type: "ADD_GOOGLE_PLACE",
            address: place.formatted_address,
            city: city,
            state: state,
            country: country,
          })
        }
      }
    }
  )
}
