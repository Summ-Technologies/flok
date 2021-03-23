import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Route, Switch} from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import NotFound404Page from "./pages/NotFound404Page"
import RedirectPage from "./pages/RedirectPage"
import RetreatPage from "./pages/RetreatPage"
import {getUserHome} from "./store/actions/user"
import UserGetters from "./store/getters/user"

type FlokRoute = {
  name: string
  component: JSX.Element
  path: string | string[]
}

export class AppRoutes {
  static loggedInRoutes: FlokRoute[] = [
    {name: "HomePage", component: <HomePage />, path: "/"},
    {name: "RetreatPage", component: <RetreatPage />, path: "/retreat"},
    {
      name: "RedirectLoggedOutPaths",
      component: <RedirectPage pageName="RetreatPage" />,
      path: ["/auth/signup", "/auth/signin"],
    },
  ]
  static loggedOutRoutes: FlokRoute[] = [
    {
      name: "SigninPage",
      component: <AuthPage />,
      path: ["/auth/signin"],
    },
    {
      name: "SignupPage",
      component: <AuthPage />,
      path: ["/auth/signup"],
    },
    {
      name: "RedirectSignup",
      component: <RedirectPage pageName="SignupPage" />,
      path: "*",
    },
  ]
  static commonRoutes: FlokRoute[] = [
    {name: "NotFoundPage", component: <NotFound404Page />, path: "*"},
  ]
  static getRoutes(routes: FlokRoute[]): JSX.Element[] {
    let routeComponent = (
      name: string,
      path: string,
      component: JSX.Element
    ) => {
      return (
        <Route path={path} key={name} exact render={() => component}></Route>
      )
    }
    return routes.reduce((prev, route) => {
      if (Array.isArray(route.path)) {
        return [
          ...prev,
          ...route.path.map((path: string, index: number) =>
            routeComponent(`${route.name}-${index}`, path, route.component)
          ),
        ]
      } else {
        return [
          ...prev,
          routeComponent(route.name, route.path, route.component),
        ]
      }
    }, new Array<JSX.Element>())
  }

  static getPath(
    name: string,
    pathParams: {[key: string]: string} = {}
  ): string {
    let route = [
      ...AppRoutes.loggedInRoutes,
      ...AppRoutes.loggedOutRoutes,
    ].filter((route) => route.name.toLowerCase() === name.toLowerCase())
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
  let dispatch = useDispatch()

  let loginStatus = useSelector(UserGetters.getLoginStatus)
  let [routes, setRoutes] = useState<JSX.Element[]>([])

  useEffect(() => {
    if (loginStatus === "UNKNOWN") {
    } else if (loginStatus === "LOGGED_IN") {
      setRoutes(
        AppRoutes.getRoutes([
          ...AppRoutes.loggedInRoutes,
          ...AppRoutes.commonRoutes,
        ])
      )
    } else if (loginStatus === "LOGGED_OUT") {
      setRoutes(
        AppRoutes.getRoutes([
          ...AppRoutes.loggedOutRoutes,
          ...AppRoutes.commonRoutes,
        ])
      )
    }
  }, [loginStatus, setRoutes])

  useEffect(() => {
    /** Helps determine user login status */
    dispatch(getUserHome())
  }, [dispatch, loginStatus])

  return <Switch>{routes}</Switch>
}
