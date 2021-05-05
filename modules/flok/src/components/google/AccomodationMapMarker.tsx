import {makeStyles} from "@material-ui/core"
import {useEffect, useState} from "react"
import ReactDOM from "react-dom"

//   let popup = new AccomodationMapMarker(
//     new google.maps.LatLng(-33.866, 151.196),
//     document.getElementById("content") as HTMLElement
//   );
//   popup.setMap(map);
// }

let useStyles = makeStyles((theme) => ({
  root: {},
  popupContainer: {
    cursor: "pointer",
    height: 0,
    position: "absolute",
    "&.large": {
      width: 200,
    },
    "&.medium": {
      width: 100,
    },
    "&.small": {
      width: 25,
    },
    "&:hover $popupBubble": {
      backgroundColor: "grey",
    },
  },
  popupBubble: {
    position: "absolute",
    top: 0,
    left: 0,
    transform: "translate(-50%, -100%)",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    fontFamily: "sans-serif",
    overflowY: "auto",
    boxShadow: "0px 2px 10px 1px rgba(0, 0, 0, 0.5)",
  },
  popupBubbleAnchor: {
    pointerEvents: "auto",
    position: "absolute",
    width: "100%",
    bottom: 8,
    left: 0,
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      transform: "translate(-50%, 0)",
      width: 0,
      height: 0,
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderTop: "8px solid white",
    },
  },
}))

type AccomodationMapMarkerProps = {
  lat: number
  long: number
  text: string
  map?: google.maps.Map
}

export default function AccomodationMapMarker(
  props: AccomodationMapMarkerProps
) {
  let classes = useStyles(props)
  let [popup, setPopup] = useState<any>(undefined)
  let content = document.createElement("div")
  ReactDOM.render(<div>{props.text}</div>, content)

  useEffect(() => {
    class Popup extends google.maps.OverlayView {
      position: google.maps.LatLng
      containerDiv: HTMLDivElement

      constructor(
        position: google.maps.LatLng,
        content: HTMLElement,
        classes: {anchor: string; container: string; bubble: string}
      ) {
        super()
        this.position = position

        classes.bubble.split(" ").map((cls) => content.classList.add(cls))

        // This zero-height div is positioned at the bottom of the bubble.
        const bubbleAnchor = document.createElement("div")
        classes.anchor.split(" ").map((cls) => bubbleAnchor.classList.add(cls))
        bubbleAnchor.appendChild(content)

        // This zero-height div is positioned at the bottom of the tip.
        this.containerDiv = document.createElement("div")
        classes.container
          .split(" ")
          .map((cls) => this.containerDiv.classList.add(cls))
        this.containerDiv.appendChild(bubbleAnchor)

        // Optionally stop clicks, etc., from bubbling up to the map.
        Popup.preventMapHitsAndGesturesFrom(this.containerDiv)
      }

      /** Called when the popup is added to the map. */
      onAdd() {
        this.getPanes()!.floatPane.appendChild(this.containerDiv)
      }

      /** Called when the popup is removed from the map. */
      onRemove() {
        if (this.containerDiv.parentElement) {
          this.containerDiv.parentElement.removeChild(this.containerDiv)
        }
      }

      /** Called each frame when the popup needs to draw itself. */
      draw() {
        const divPosition = this.getProjection().fromLatLngToDivPixel(
          this.position
        )!

        // Hide the popup when it is far out of view.
        const display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? "block"
            : "none"

        if (display === "block") {
          this.containerDiv.style.left = divPosition.x + "px"
          this.containerDiv.style.top = divPosition.y + "px"
        }

        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display
        }
      }
    }
    if (props.map && !popup) {
      let _popup = new Popup(
        new google.maps.LatLng(props.lat, props.long),
        content,
        {
          anchor: classes.popupBubbleAnchor,
          container: classes.popupContainer,
          bubble: classes.popupBubble,
        }
      )
      _popup.setMap(props.map)
      setPopup(_popup)
    }
  }, [props, popup, setPopup, classes, content])

  useEffect(() => {
    if (props.map && popup) {
      props.map.addListener("zoom_changed", () => {
        if (props.map && popup) {
          if (props.map.getZoom() <= 4) {
            ;(popup.containerDiv as HTMLElement).classList.remove("large")
            ;(popup.containerDiv as HTMLElement).classList.remove("medium")
            ;(popup.containerDiv as HTMLElement).classList.add("small")
          } else if (props.map.getZoom() <= 7) {
            ;(popup.containerDiv as HTMLElement).classList.remove("large")
            ;(popup.containerDiv as HTMLElement).classList.add("medium")
            ;(popup.containerDiv as HTMLElement).classList.remove("small")
          } else {
            ;(popup.containerDiv as HTMLElement).classList.add("large")
            ;(popup.containerDiv as HTMLElement).classList.remove("medium")
            ;(popup.containerDiv as HTMLElement).classList.remove("small")
          }
        }
      })
    }
  }, [popup, props.map])

  return <></>
}
