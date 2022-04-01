import {makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React, {useEffect} from "react"
import {useScript} from "../../utils"

let useStyles = makeStyles((theme) => ({
  root: {},
  itinerary: {
    overflow: "auto",
    height: "100%",
  },
}))

type AppTravefyItineraryProps = {travefyItineraryId: string}
export default function AppTravefyItinerary(props: AppTravefyItineraryProps) {
  let classes = useStyles(props)
  let [loaded] = useScript("/travefy.itinerary.1.0.js")
  useEffect(() => {
    if (loaded) {
      ;(window as any).initTravefy()
    }
  }, [loaded, props.travefyItineraryId])
  return (
    <div
      data-travefy-itinerary-id={props.travefyItineraryId}
      className={clsx("travefy-itinerary", classes.itinerary)}></div>
  )
}
