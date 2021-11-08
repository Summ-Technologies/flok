import algoliasearch, {SearchClient, SearchIndex} from "algoliasearch"
import config, {
  ALGOLIA_DESTINATIONS_INDEX_KEY,
  ALGOLIA_HOTELS_INDEX_KEY,
} from "../config"
import {FilterAnswerModel} from "../models/retreat"

class _AlgoliaClient {
  searchClient: SearchClient | undefined
  destinationsIndex: SearchIndex | undefined
  hotelsIndex: SearchIndex | undefined

  getSearchClient() {
    if (!this.searchClient) {
      this.searchClient = algoliasearch(
        "0GNPYG0XAN",
        "1bfd529008a4c2c0945b629b44707593"
      )
    }
    return this.searchClient
  }

  getDestinationsIndex() {
    if (!this.destinationsIndex) {
      this.destinationsIndex = this.getSearchClient().initIndex(
        config.get(ALGOLIA_DESTINATIONS_INDEX_KEY)
      )
    }
    return this.destinationsIndex
  }

  getHotelsIndex() {
    if (!this.hotelsIndex) {
      this.hotelsIndex = this.getSearchClient().initIndex(
        config.get(ALGOLIA_HOTELS_INDEX_KEY)
      )
    }
    return this.hotelsIndex
  }
}

export let AlgoliaClient = new _AlgoliaClient()

/**
 * Deterministic independent of ordering
 */
export function getAlgoliaHotelFilterString(
  selectedFilterAnswers: number[],
  filterAnswers: FilterAnswerModel[],
  selectedDestinationIds: number[]
) {
  let retreatFilters = filterAnswers
    .filter((ans) => selectedFilterAnswers.includes(ans.id))
    .sort()
    .filter((ans) => ans.algolia_filter)
    .map((ans) => `${ans.algolia_filter}`)
    .filter((_) => _)
    .join(" OR ")
  let destinationFilters = selectedDestinationIds
    .map((id) => `destination_id=${id}`)
    .sort()
    .join(" OR ")
  return [retreatFilters, destinationFilters]
    .filter((_) => _)
    .map((filt) => `(${filt})`)
    .join(" AND ")
}

export function getAlgoliaDestinationFilterString(
  selectedFilterAnswers: number[],
  filterAnswers: FilterAnswerModel[]
) {
  return filterAnswers
    .filter((ans) => selectedFilterAnswers.includes(ans.id))
    .sort()
    .filter((ans) => ans.algolia_filter)
    .map((ans) => `${ans.algolia_filter}`)
    .filter((_) => _)
    .join(" OR ")
}
