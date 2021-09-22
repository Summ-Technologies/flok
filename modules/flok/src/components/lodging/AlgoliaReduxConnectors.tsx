import React, {useEffect, useState} from "react"
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
  let [searchResultsSaved, setSearchResultsSaved] = useState<string[]>([])
  useEffect(() => {
    let searchKey = searchResults
      ? `${searchResults.query}-${searchResults.page}-${searchResults.index}`
      : undefined
    if (searchKey && !searchResultsSaved.includes(searchKey)) {
      dispatch(updateHotels(searchResults.hits))
      setSearchResultsSaved([...searchResultsSaved, searchKey])
    }
  }, [searchResults, dispatch, searchResultsSaved, setSearchResultsSaved])
  return <></>
}

export const HotelsAlgoliaReduxConnector = connectStateResults(
  _HotelsAlgoliaReduxConnector
)
