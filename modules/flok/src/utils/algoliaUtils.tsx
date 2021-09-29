import algoliasearch, {SearchClient, SearchIndex} from "algoliasearch"
import config, {
  ALGOLIA_DESTINATIONS_INDEX_KEY,
  ALGOLIA_HOTELS_INDEX_KEY,
} from "../config"
import {BudgetType} from "../models/lodging"

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
export function getAlgoliaFilterString(
  destinationFilter: number[],
  budgetFilter: BudgetType[]
) {
  return [
    destinationFilter
      .sort()
      .map((destId) => `destination_id=${destId}`)
      .join(" OR "),
    budgetFilter
      .sort()
      .map((priceOption) => `price:"${priceOption}"`)
      .join(" OR "),
  ]
    .filter((_) => _) // remove empty
    .join(" AND ")
}
