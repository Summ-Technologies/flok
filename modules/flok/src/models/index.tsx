export type GooglePlaceType = {
  place_id: string
  reference: string
  description: string
  terms: {offset: number; value: string}[]
  types: string[]
  structured_formatting: {
    main_text: string
    secondary_text: string
    main_text_matched_substrings: [
      {
        offset: number
        length: number
      }
    ]
  }
}
