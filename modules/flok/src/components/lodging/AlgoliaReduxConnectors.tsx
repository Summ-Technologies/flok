import React, {useEffect} from "react"
import {
  connectStateResults,
  StateResultsProvided,
} from "react-instantsearch-core"
import {useDispatch} from "react-redux"
import {HotelModel} from "../../models/lodging"
import {updateHotels} from "../../store/actions/lodging"

type HotelsAlgoliaReduxConnectorProps = StateResultsProvided<HotelModel>
function _HotelsAlgoliaReduxConnector(props: HotelsAlgoliaReduxConnectorProps) {
  let dispatch = useDispatch()
  let {searchResults} = {...props}
  useEffect(() => {
    console.log(searchResults)
    if (searchResults) {
      dispatch(updateHotels(searchResults.hits))
    }
  }, [searchResults, dispatch])
  return <></>
}

export const HotelsAlgoliaReduxConnector = connectStateResults(
  _HotelsAlgoliaReduxConnector
)
