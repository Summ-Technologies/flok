import {Action} from "redux"
import {EmployeeModel} from "../../models/employee"

export type RetreatState = {
  attendees: EmployeeModel[]
}

const initialState: RetreatState = {
  attendees: [
    {id: 1, name: "Harris Stolzenberg", city: "New York City, NY"},
    {id: 2, name: "Sarah Corsa", city: "New York City, NY"},
    {id: 3, name: "Lauren Whitte", city: "New York City, NY"},
    {id: 4, name: "Sam Hollingsworth", city: "New York City, NY"},
    {id: 5, name: "Simmi Shulman", city: "Santa Cruz, CA"},
    {id: 6, name: "Yan Lhert", city: "Austin, TX"},
    {id: 7, name: "Jared Hanson", city: "Benicia, CA"},
  ],
}

export default function userReducer(
  state: RetreatState = initialState,
  action: Action
): RetreatState {
  // var payload
  switch (action.type) {
    default:
      return state
  }
}
