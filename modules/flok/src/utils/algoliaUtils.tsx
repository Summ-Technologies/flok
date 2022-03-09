import algoliasearch, {SearchClient, SearchIndex} from "algoliasearch"
import config, {
  ALGOLIA_DESTINATIONS_INDEX_KEY,
  ALGOLIA_HOTELS_INDEX_KEY,
} from "../config"

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
export function getAlgoliaHotelFilterString(selectedDestinationIds: number[]) {
  let destinationFilters = selectedDestinationIds
    .map((id) => `destination_id=${id}`)
    .sort()
    .join(" OR ")
  return destinationFilters
}
