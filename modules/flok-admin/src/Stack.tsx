import React from "react"
import {Route, Switch} from "react-router-dom"
import HomePage from "./pages/HomePage"
import RetreatPage from "./pages/RetreatPage"
import RetreatsPage from "./pages/RetreatsPage"

type FlokRoute = {
  name: string
  component: JSX.Element
  path: string | string[]
  loginStatus?:
    | ("UNKNOWN" | "LOGGED_IN" | "LOGGED_OUT")[]
    | "UNKNOWN"
    | "LOGGED_IN"
    | "LOGGED_OUT"
}

export class AppRoutes {
  static routes: FlokRoute[] = [
    {name: "HomePage", component: <HomePage />, path: "/"},
    {name: "RetreatsPage", component: <RetreatsPage />, path: "/retreats"},
    {name: "RetreatPage", component: <RetreatPage />, path: "/retreats/:id"},
  ]
  static getRoutes(routes: FlokRoute[]): JSX.Element[] {
    return routes.map((route) => (
      <Route
        path={route.path}
        key={route.name}
        exact
        render={() => route.component}></Route>
    ))
  }

  static getPath(
    name: string,
    pathParams: {[key: string]: string} = {}
  ): string {
    let route: {path: string; name: string}[] = (
      this.routes as {path: string; name: string}[]
    ).filter((route) => route.name.toLowerCase() === name.toLowerCase())
    if (route.length !== 1) {
      throw Error("Can't get path for route named: " + name)
    }
    let _path = route[0].path
    let path: string
    if (Array.isArray(_path)) {
      path = _path[0]
    } else {
      path = _path
    }
    Object.keys(pathParams).forEach((key) => {
      let value = pathParams[key]
      let toReplace = ":" + key
      path = path.replace(toReplace, value)
    })
    return path
  }
}

export default function Stack() {
  return <Switch>{AppRoutes.getRoutes(AppRoutes.routes)}</Switch>
}
