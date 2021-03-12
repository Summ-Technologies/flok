import config, {IMAGES_BASE_URL_KEY} from "../config"

function imageSizing(
  name: string
): {default: string; sm: string; md: string; lg: string; xl: string} {
  return {
    default: `${name}.png`,
    sm: `${name}@.5x.png`,
    md: `${name}.png`,
    lg: `${name}@2x.png`,
    xl: `${name}@3x.png`,
  }
}

const IMAGES: {
  [key: string]: {
    default: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
} = {
  logoIcon: imageSizing("branding/logos/icon-white_bg"),
  logoIconTrans: imageSizing("branding/logos/icon-empty_bg"),
  logoIconRound: imageSizing("branding/logos/icon-white_bg-rounded"),
  logoIconTransRound: imageSizing("branding/logos/icon-empty_bg-rounded"),
  logoIconText: imageSizing("branding/logos/icon_text-white_bg"),
  logoIconTextTrans: imageSizing("branding/logos/icon_text-empty_bg"),
}

export class ImageUtils {
  static getImagePath(name: string, size?: "sm" | "md" | "lg" | "xl"): string {
    var path
    const imgs = IMAGES[name]
    if (imgs) {
      if (size) {
        path = imgs[size]
      }
      if (!path) {
        path = imgs.default
      }
    } else {
      path = `${name}.png`
    }
    return path
  }
  static getImageProps(
    name: string,
    alt: string,
    size?: "sm" | "md" | "lg" | "xl"
  ): {src: string; alt: string} {
    let baseUrl: string = config.get(IMAGES_BASE_URL_KEY)
    if (!baseUrl.endsWith("/")) {
      baseUrl = baseUrl + "/"
    }
    let src = `${baseUrl}${ImageUtils.getImagePath(name, size)}`
    return {src, alt}
  }
}
