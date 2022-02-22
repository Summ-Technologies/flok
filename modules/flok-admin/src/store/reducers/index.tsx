import notistackReducer from "../../notistack-lib/reducer"
import adminReducer from "./admin"
const reducers = {
  admin: adminReducer,
  notistack: notistackReducer,
}

export default reducers
