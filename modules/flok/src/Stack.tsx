import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Route, Switch} from "react-router-dom"
import AuthPage from "./pages/auth/AuthPage"
import AuthResetPage from "./pages/auth/AuthResetPage"
import AccomodationsSearchPage from "./pages/dashboard/AccomodationsSearchPage"
import ProposalsPage from "./pages/dashboard/ProposalsPage"
import HomePage from "./pages/HomePage"
import NotFound404Page from "./pages/misc/NotFound404Page"
import RedirectPage from "./pages/misc/RedirectPage"
import {getUserHome} from "./store/actions/user"
import UserGetters from "./store/getters/user"

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
    {
      name: "HomePage",
      component: <HomePage />,
      path: "/",
      loginStatus: "LOGGED_IN",
    },
    {name: "ProposalsPage", component: <ProposalsPage />, path: "/proposals"},
    {
      name: "AccomodationsSearchPage",
      component: <AccomodationsSearchPage />,
      path: ["/accomodations", "/accomodations/:id"],
    },
    {
      name: "SigninPage",
      component: <AuthPage />,
      path: "/auth/signin",
      loginStatus: "LOGGED_OUT",
    },
    {
      name: "SignupPage",
      component: <AuthPage />,
      path: "/auth/signup",
      loginStatus: "LOGGED_OUT",
    },
    {
      name: "AuthResetPage",
      component: <AuthResetPage />,
      path: "/auth/reset",
      loginStatus: "LOGGED_OUT",
    },
    {
      name: "RedirectSignup",
      component: <RedirectPage pageName="SignupPage" />,
      path: "*",
      loginStatus: "LOGGED_OUT",
    },
    {
      name: "RedirectLoggedOutPaths",
      component: <RedirectPage pageName="HomePage" />,
      path: ["/auth/signup", "/auth/signin", "/auth/reset"],
      loginStatus: "LOGGED_IN",
    },
    {
      name: "NotFoundPage",
      component: <NotFound404Page />,
      path: "*",
      loginStatus: ["LOGGED_IN", "UNKNOWN"],
    },
  ]
  static PATH_OVERRIDES = [
    {name: "AccomodationsDetailsOverlayPage", path: "/accomodations/:id"},
  ]
  static getRoutes(routes: FlokRoute[]): JSX.Element[] {
    let routeComponent = (
      name: string,
      path: string | string[],
      component: JSX.Element
    ) => {
      return (
        <Route path={path} key={name} exact render={() => component}></Route>
      )
    }
    return routes.reduce((prev, route) => {
      return [...prev, routeComponent(route.name, route.path, route.component)]
    }, new Array<JSX.Element>())
  }

  static getPath(
    name: string,
    pathParams: {[key: string]: string} = {}
  ): string {
    let route: {path: string; name: string}[] = (
      this.routes as {path: string; name: string}[]
    ).filter((route) => route.name.toLowerCase() === name.toLowerCase())
    if (route.length !== 1) {
      route = this.PATH_OVERRIDES.filter(
        (path) => path.name.toLowerCase() === name.toLowerCase()
      )
    }
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
    setRoutes(
      AppRoutes.getRoutes(
        AppRoutes.routes.filter((val) =>
          val.loginStatus &&
          (val.loginStatus !== loginStatus ||
            !val.loginStatus.includes(loginStatus))
            ? false
            : true
        )
      )
    )
  }, [loginStatus, setRoutes])

  useEffect(() => {
    /** Helps determine user login status */
    dispatch(getUserHome())
  }, [dispatch, loginStatus])

  return <Switch>{routes}</Switch>
}
