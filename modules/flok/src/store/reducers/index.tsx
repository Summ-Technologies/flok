import apiReducer from "./api"
import companyReducer from "./company"
import retreatReducer from "./retreat"
import userReducer from "./user"

const reducers = {
  user: userReducer,
  api: apiReducer,
  company: companyReducer,
  retreat: retreatReducer,
}
export default reducers
