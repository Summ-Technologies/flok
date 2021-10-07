import {Constants} from "../config"
import {ResourceNotFound} from "../models"
import {useRetreat} from "../utils/lodgingUtils"
import RedirectPage from "./misc/RedirectPage"

type HomeRoutingPageProps = {}

/**
 * Redirects to the getting-started form,
 * or your most recent active retreat if present
 */
export default function HomeRoutingPage(props: HomeRoutingPageProps) {
  let retreatGuid = localStorage.getItem(Constants.localStorageRetreatGuidKey)
  let retreat = useRetreat(retreatGuid ?? "")

  return retreatGuid === null ? (
    <RedirectPage pageName="NewRetreatFormPage" />
  ) : retreat === ResourceNotFound ? (
    <RedirectPage pageName="NewRetreatFormPage" />
  ) : retreat !== undefined ? (
    <RedirectPage pageName="RetreatRoutingPage" pathParams={{retreatGuid}} />
  ) : (
    <></>
  )
}
