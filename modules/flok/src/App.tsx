import {ThemeProvider} from "@material-ui/styles"
import {ConnectedRouter} from "connected-react-router"
import React, {useEffect} from "react"
import {Provider} from "react-redux"
import {polyfill as seamlessScrollPolyfill} from "seamless-scroll-polyfill"
import Stack from "./Stack"
import store, {history} from "./store"
import {theme} from "./theme"

export default function App() {
  useEffect(() => {
    seamlessScrollPolyfill()
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <Stack />
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  )
}
