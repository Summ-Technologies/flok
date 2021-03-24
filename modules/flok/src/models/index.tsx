export type GooglePlaceType = {
  placeId: string
  reference: string
  description: string
  terms: {offset: number; value: string}[]
  types: string[]
  structuredFormatting: {
    mainText: string
    secondaryText: string
    mainTextMatchedSubstrings: [
      {
        offset: number
        length: number
      }
    ]
  }
}
