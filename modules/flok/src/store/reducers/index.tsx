import notistackReducer from "../../notistack-lib/reducer"
import apiReducer from "./api"
import userReducer from "./user"
import rfpLiteRequestReducer from "./rfpLiteRequest"

const reducers = {
  user: userReducer,
  notistack: notistackReducer,
  rfp_lite: rfpLiteRequestReducer,
  api: apiReducer,
}

export default reducers
