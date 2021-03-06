import {CssBaseline} from "@material-ui/core"
import {ThemeProvider} from "@material-ui/styles"
import {ConnectedRouter} from "connected-react-router"
import {SnackbarProvider} from "notistack"
import React, {useEffect} from "react"
import {Provider} from "react-redux"
import {polyfill as seamlessScrollPolyfill} from "seamless-scroll-polyfill"
import Notistack from "./notistack-lib/Notistack"
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
          <SnackbarProvider>
            <Notistack />
            <CssBaseline />
            <Stack />
          </SnackbarProvider>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  )
}
