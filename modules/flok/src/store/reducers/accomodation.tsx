import {Action} from "redux"
import {AccomodationModel, DestinationModel} from "../../models/accomodation"

export type AccomodationState = {
  accomodations: {[key: number]: AccomodationModel}
  destinations: {[key: number]: DestinationModel}
}

const initialState: AccomodationState = {
  accomodations: {
    1: {
      id: 1,
      lat: 37.774,
      long: -122.419,
      airport: "1 hour drive from SJC airport",
      city: "Santa Cruz, California",
      employees: "10 - 150",
      img:
        "https://flok-b32d43c.s3.amazonaws.com/misc/paradox-santacruz/paradox-pool-lounge.jpg",
      name: "Paradox Hotel",
      pricing: "$300 / night",
      destinationId: 1,
    },
    2: {
      id: 2,
      lat: 37.974,
      long: -122.419,
      airport: "1 hour drive from SJC airport",
      city: "Santa Cruz, California",
      employees: "10 - 150",
      img:
        "https://flok-b32d43c.s3.amazonaws.com/misc/paradox-santacruz/paradox-pool-lounge.jpg",
      name: "Paradox Hotel",
      pricing: "$300 / night",
      destinationId: 1,
    },
    3: {
      id: 1,
      lat: 37.774,
      long: -129.419,
      airport: "1 hour drive from SJC airport",
      city: "Santa Cruz, California",
      employees: "10 - 150",
      img:
        "https://flok-b32d43c.s3.amazonaws.com/misc/paradox-santacruz/paradox-pool-lounge.jpg",
      name: "Paradox Hotel",
      pricing: "$300 / night",
      destinationId: 1,
    },
    8: {
      id: 8,
      lat: 32.774,
      long: -122.419,
      airport: "1 hour drive from SJC airport",
      city: "Santa Cruz, California",
      employees: "10 - 150",
      img:
        "https://flok-b32d43c.s3.amazonaws.com/misc/paradox-santacruz/paradox-pool-lounge.jpg",
      name: "Paradox Hotel",
      pricing: "$300 / night",
      destinationId: 2,
    },
    4: {
      id: 4,
      lat: 37.774,
      long: -121.419,
      airport: "1 hour drive from SJC airport",
      city: "Santa Cruz, California",
      employees: "10 - 150",
      img:
        "https://flok-b32d43c.s3.amazonaws.com/misc/paradox-santacruz/paradox-pool-lounge.jpg",
      name: "Paradox Hotel",
      pricing: "$300 / night",
      destinationId: 2,
    },
    5: {
      id: 5,
      lat: 36.774,
      long: -122.419,
      airport: "1 hour drive from SJC airport",
      city: "Santa Cruz, California",
      employees: "10 - 150",
      img:
        "https://flok-b32d43c.s3.amazonaws.com/misc/paradox-santacruz/paradox-pool-lounge.jpg",
      name: "Paradox Hotel",
      pricing: "$300 / night",
      destinationId: 2,
    },
    6: {
      id: 6,
      lat: 37.774,
      long: -124.419,
      airport: "1 hour drive from SJC airport",
      city: "Santa Cruz, California",
      employees: "10 - 150",
      img:
        "https://flok-b32d43c.s3.amazonaws.com/misc/paradox-santacruz/paradox-pool-lounge.jpg",
      name: "Paradox Hotel",
      pricing: "$300 / night",
      destinationId: 3,
    },
    7: {
      id: 7,
      lat: 38.774,
      long: -122.419,
      airport: "1 hour drive from SJC airport",
      city: "Santa Cruz, California",
      employees: "10 - 150",
      img:
        "https://flok-b32d43c.s3.amazonaws.com/misc/paradox-santacruz/paradox-pool-lounge.jpg",
      name: "Paradox Hotel",
      pricing: "$300 / night",
      destinationId: 3,
    },
  },
  destinations: {
    1: {
      id: 1,
      name: "San Franscisco Bay Area",
      lat: 38.774,
      long: -122.419,
    },
    2: {
      id: 2,
      name: "Austin, TX",
      lat: 30.2672,
      long: -97.7431,
    },
    3: {
      id: 3,
      name: "Miami, Fl",
      lat: 25.7617,
      long: -80.1918,
    },
  },
}

export default function userReducer(
  state: AccomodationState = initialState,
  action: Action
): AccomodationState {
  switch (action.type) {
    default:
      return state
  }
}
