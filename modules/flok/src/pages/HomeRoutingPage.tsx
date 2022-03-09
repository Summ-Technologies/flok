import RedirectPage from "./misc/RedirectPage"

/**
 * Redirects to the getting-started form,
 * or your most recent active retreat if present
 */
export default function HomeRoutingPage() {
  return (
    <RedirectPage pageName="RetreatHomePage" pathParams={{retreatIdx: "0"}} />
  )
}
