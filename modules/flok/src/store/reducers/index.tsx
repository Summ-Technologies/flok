import notistackReducer from "../../notistack-lib/reducer"
import userReducer from "./user"

const reducers = {
  user: userReducer,
  notistack: notistackReducer,
}

export default reducers
