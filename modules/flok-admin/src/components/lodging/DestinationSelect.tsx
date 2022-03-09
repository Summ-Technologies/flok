import {TextField, TextFieldProps} from "@material-ui/core"
import React from "react"
import {useDestinations} from "../../utils"

type DestinationSelectProps = TextFieldProps
export default function DestinationSelect(props: DestinationSelectProps) {
  let [destinations, destinationsLoading] = useDestinations()
  return (
    <TextField
      select
      SelectProps={{native: true}}
      fullWidth
      label="Destinations"
      placeholder="Select a destination"
      InputLabelProps={{shrink: true}}
      {...props}>
      {!props.value && <option value={undefined}>Select a destination</option>}
      {destinationsLoading && (
        <option value={undefined}>Loading destinations...</option>
      )}
      {Object.values(destinations)
        .sort((destA, destB) => destA!.location.localeCompare(destB!.location))
        .map((dest) => (
          <option value={dest!.id}>{dest!.location}</option>
        ))}
    </TextField>
  )
}
