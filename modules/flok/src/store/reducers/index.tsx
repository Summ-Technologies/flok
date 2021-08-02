import notistackReducer from "../../notistack-lib/reducer"
import apiReducer from "./api"
import userReducer from "./user"

const reducers = {
  user: userReducer,
  notistack: notistackReducer,
  api: apiReducer,
}

export default reducers
