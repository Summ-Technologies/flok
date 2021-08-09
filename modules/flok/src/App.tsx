import {CssBaseline} from "@material-ui/core"
import {ThemeProvider} from "@material-ui/styles"
import {ConnectedRouter} from "connected-react-router"
import {SnackbarProvider} from "notistack"
import React, {useEffect} from "react"
import MixPanelProvider from "react-mixpanel-provider-component"
import {Provider} from "react-redux"
import {polyfill as seamlessScrollPolyfill} from "seamless-scroll-polyfill"
import config from "./config"
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
      <MixPanelProvider token={config.get("mixpanel_token")}>
        <ThemeProvider theme={theme}>
          <ConnectedRouter history={history}>
            <SnackbarProvider>
              <Notistack />
              <CssBaseline />
              <Stack />
            </SnackbarProvider>
          </ConnectedRouter>
        </ThemeProvider>
      </MixPanelProvider>
    </Provider>
  )
}
