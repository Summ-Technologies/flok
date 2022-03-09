import RedirectPage from "../misc/RedirectPage"

/**
 * Redirects to the getting-started form,
 * or your most recent active retreat if present
 */
export default function DeprecatedHomeRoutingPage() {
  return <RedirectPage pageName="DeprecatedNewRetreatFormPage" />
}
