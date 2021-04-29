/* Config keys */
// Make sure any keys changed here are adjusted in the setup_config.sh script
export const APP_VERSION_KEY = "app_version"
export const SERVER_BASE_URL_KEY = "server_base_url"
export const IMAGES_BASE_URL_KEY = "images_base_url"
export const GOOGLE_API_KEY = "google_api_key"
export const STRIPE_KEY = "stripe_key"
export const FLOK_DISCOUNT_KEY = "flok_discount_key"
export const FLOK_FEE_KEY = "flok_fee_key"
type ConfigKey =
  | typeof APP_VERSION_KEY
  | typeof SERVER_BASE_URL_KEY
  | typeof IMAGES_BASE_URL_KEY
  | typeof GOOGLE_API_KEY
  | typeof STRIPE_KEY
  | typeof FLOK_DISCOUNT_KEY
  | typeof FLOK_FEE_KEY

class Config {
  appConfig: {[key: string]: any}
  defaultConfig: {[key: string]: any} = {
    [APP_VERSION_KEY]: process.env.REACT_APP_VERSION,
    [FLOK_FEE_KEY]: 250,
    [FLOK_DISCOUNT_KEY]: 0.5,
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

      let imagesUrl = process.env.REACT_APP_IMAGES_URL
      if (imagesUrl) {
        this.appConfig[IMAGES_BASE_URL_KEY] = imagesUrl
      } else {
        throw Error("Environment variable missing: REACT_APP_IMAGES_URL")
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
