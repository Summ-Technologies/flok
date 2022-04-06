import {ListItem, ListItemText, TextField} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import React, {useState} from "react"
import {useHotelsBySearch} from "../../utils"

type HotelSearchBarProps = {
  onSelect: (hotelId: number) => void
}
export default function HotelSearchBar(props: HotelSearchBarProps) {
  let [input, setInput] = useState("")
  let [results, loading] = useHotelsBySearch(input.slice(0, 3))
  return (
    <Autocomplete
      loading={loading}
      clearOnBlur={false}
      fullWidth
      onChange={(e, val) => {
        if (val) props.onSelect(val.id)
      }}
      noOptionsText={
        input.length < 3 ? "At least 3 characters required" : undefined
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search by hotel name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )}
      options={results}
      getOptionLabel={(option) => option.name}
      filterOptions={(options, state) => {
        return options
          .filter((val) => val.name.toLowerCase().includes(input.toLowerCase()))
          .sort((a, b) => {
            let matchA = a.name.toLowerCase().indexOf(input.toLowerCase())
            let matchB = b.name.toLowerCase().indexOf(input.toLowerCase())
            return matchA > matchB ? 1 : matchA === matchB ? 0 : -1
          })
      }}
      renderOption={(option) => {
        let matchStart = option.name.toLowerCase().indexOf(input.toLowerCase())
        let pre = option.name.slice(0, matchStart)
        let match = option.name.slice(matchStart, matchStart + input.length)
        let post = option.name.slice(matchStart + input.length)
        return (
          <ListItem>
            <ListItemText>
              {pre}
              <strong>{match}</strong>
              {post}, {option.location.toUpperCase()}
            </ListItemText>
          </ListItem>
        )
      }}
    />
  )
}
