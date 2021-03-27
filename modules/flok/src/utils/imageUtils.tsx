import config, {IMAGES_BASE_URL_KEY} from "../config"

enum IMAGES {
  logoIcon = "branding/logos/icon-white_bg.png",
  logoIconTrans = "branding/logos/icon-empty_bg.png",
  logoIconRound = "branding/logos/icon-white_bg-rounded.png",
  logoIconTransRound = "branding/logos/icon-empty_bg-rounded.png",
  logoIconText = "branding/logos/icon_text-white_bg.png",
  logoIconTextTrans = "branding/logos/icon_text-empty_bg.png",
}
export type KnownImageKey = keyof typeof IMAGES
export class ImageUtils {
  /**
   * Get image url for known image, can also pass the path to the image
   *    as `key` if it's not a "known" image (aka one in ImageUtils.IMAGES)
   */
  static getImageUrl(key: KnownImageKey | string): string {
    let baseUrl: string = config.get(IMAGES_BASE_URL_KEY)
    if (!baseUrl.endsWith("/")) baseUrl = baseUrl + "/"
    let path = key
    if (key in IMAGES) path = IMAGES[key as KnownImageKey]
    return `${baseUrl}${path}`
  }
}
