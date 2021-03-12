/* Config keys */
// Make sure any keys changed here are adjusted in the setup_config.sh script
export const APP_VERSION_KEY = "app_version"
export const SERVER_BASE_URL_KEY = "server_base_url"
type ConfigKey = typeof APP_VERSION_KEY | typeof SERVER_BASE_URL_KEY

class Config {
  appConfig: {[key: string]: any}
  defaultConfig: {[key: string]: any} = {
    [APP_VERSION_KEY]: process.env.REACT_APP_VERSION,
  }
  constructor() {
    this.appConfig = {}
    // Set url values passed in at runtime
    if (process.env.NODE_ENV === "development") {
      // When in development mode, comes from ENV_VAR
      let apiUrl = process.env.REACT_APP_API_URL
      if (apiUrl) {
        this.appConfig[SERVER_BASE_URL_KEY] = apiUrl
      } else {
        throw Error("Environment variable missing: REACT_APP_API_URL")
      }
      Object.keys(process.env).forEach((envVar) => {
        if (envVar.toLowerCase().startsWith("react_app_")) {
          let key = envVar.toLowerCase().replace("react_app_", "")
          let val = process.env[envVar]
          this.appConfig[key] = val
        }
      })
    } else {
      // When in production, comes from config.js file at runtime
      let windowConfig = ((window as any) as {appConfig: any}).appConfig
      if (windowConfig) {
        this.appConfig = {
          ...windowConfig,
        }
      }
    }
  }
  get(configKey: ConfigKey): any {
    var val = this.appConfig[configKey]
    if (val === undefined) {
      val = this.defaultConfig[configKey]
    }
    return val
  }
  set(configKey: ConfigKey, configVal: any): void {
    /* Updates global app config object */
    this.appConfig[configKey] = configVal
  }
}

var config = new Config()
export default config
