import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { apiMiddleware } from "redux-api-middleware";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./reducers";

export const history = createBrowserHistory();

const reducer = combineReducers({
  ...reducers,
  router: connectRouter(history),
});
export type RootState = ReturnType<typeof reducer>;
const createStoreWithMiddleware = composeWithDevTools(
  applyMiddleware(apiMiddleware, thunk, routerMiddleware(history))
)(createStore);

export default createStoreWithMiddleware(reducer);
