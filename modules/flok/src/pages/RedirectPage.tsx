import querystring from "querystring"
import {Redirect} from "react-router-dom"
import {AppRoutes} from "../Stack"

type RedirectPageProps = {
  pageName: string
  pathParams?: {[key: string]: string}
  queryParams?: {[key: string]: string}
}

/**
 * Enables a Redirect component using page name and AppRoutes.getPath
 *
 * A simple wrapper for the react-router-dom: Redirect component
 */
export default function RedirectPage(props: RedirectPageProps) {
  let path = AppRoutes.getPath(props.pageName, props.pathParams)
  if (props.queryParams) {
    path = `${path}?${querystring.stringify(props.queryParams)}`
  }
  return <Redirect to={path} />
}
