import notistackReducer from "../../notistack-lib/reducer"
import apiReducer from "./api"
import lodgingReducer from "./lodging"
import userReducer from "./user"

const reducers = {
  user: userReducer,
  notistack: notistackReducer,
  api: apiReducer,
  lodging: lodgingReducer,
}

export default reducers
