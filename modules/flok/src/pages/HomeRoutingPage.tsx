import {ResourceNotFound} from "../models"
import {LOCAL_STORAGE_RETREAT_KEY} from "../utils"
import {useRetreat} from "../utils/lodgingUtils"
import RedirectPage from "./misc/RedirectPage"

type HomeRoutingPageProps = {}

/**
 * Redirects to the getting-started form,
 * or your most recent active retreat if present
 */
export default function HomeRoutingPage(props: HomeRoutingPageProps) {
  let retreatGuid = localStorage.getItem(LOCAL_STORAGE_RETREAT_KEY)
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
