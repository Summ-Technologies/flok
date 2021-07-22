import notistackReducer from "../../notistack-lib/reducer"
import retreatReducer from "./retreat"
import userReducer from "./user"

const reducers = {
  user: userReducer,
  retreat: retreatReducer,
  notistack: notistackReducer,
}

export default reducers
